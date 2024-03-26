import { Location, LocationPrice, Product, Storage } from '../model';
import { createDailyReports } from './util/reportUtils';
import { sequelize } from '../util/db';
import { Op, QueryTypes } from 'sequelize';

export const typeDef: string = `
    extend type Query {
        report(input: ReportInput!): Report!
    }

    input ReportInput {
        startDate: String!
        endDate: String!
        locationIds: [Int]!
    }

    type Report {
        locationReports: [LocationReport]!
    }

    type LocationReport {
        location: Location!
        dailyReports: [DailyReport]!
        totalCost: Float!
    }

    type DailyReport {
        date: String!
        productReports: [ProductReport]
        totalDailyPallets: Int!
        totalDailyCost: Float!
    }

    type ProductReport {
        product: Product!
        palletAmount: Int!
        cost: Float!
    }
`

export interface ReportInput {
    startDate: string
    endDate: string
    locationIds: number[]
}

interface Report {
    locationReports: LocationReport[]
}

export interface LocationReport {
    location: Location
    dailyReports: DailyReport[]
    totalCost: number
}

export interface DailyReport {
    date: string
    productReports: ProductReport[]
    totalDailyPallets: number
    totalDailyCost: number
}

export interface ProductReport {
    product: Product
    palletAmount: number
    cost: number
}

export const resolvers = {
    Query: {
        report: async (_: unknown, args: { input: ReportInput }): Promise<Report> => {

            const startDate: Date = new Date(args.input.startDate)
            const endDate: Date = new Date(args.input.endDate)

            // Fetch locations specified in the query by id
            const { locationIds } = args.input
            const locations: Location[] = await Location.findAll({
                where: {
                    locationId: {
                        [Op.in]: locationIds
                    }
                },
            });
            
            // get valid prices for the date range
            const priceQuery: string = ` 
            -- Prices that are valid on start date
            SELECT "lp"."locationPriceId", "lp"."price", "lp"."validFrom", "lp"."locationId"
            FROM "locationPrice" "lp"
            WHERE "lp"."validFrom" = (
                SELECT MAX("lp2"."validFrom")
                FROM "locationPrice" "lp2"
                WHERE "lp2"."validFrom" <= :startDate
                AND "lp2"."locationId" = "lp"."locationId"
            )
            AND "lp"."locationId" IN (:locationIds)
            
            UNION
            
            -- Price changes within the date range
            SELECT "lp"."locationPriceId", "lp"."price", "lp"."validFrom", "lp"."locationId"
            FROM "locationPrice" "lp"
            WHERE "lp"."validFrom" >= :startDate
            AND "lp"."validFrom" <= :endDate --Price can change only at start of day time 00:00:00
            AND "lp"."locationId" IN (:locationIds)

            ORDER BY "validFrom" ASC;
            `

            const locationPrices: LocationPrice[] = await sequelize.query(priceQuery, {
                    replacements: { locationIds: locationIds, startDate: startDate, endDate: endDate },
                    type: QueryTypes.SELECT
            })

            // add prices to their respective locations
            locationPrices.forEach(locationPrice => {
                const location = locations.find(location => location.locationId === locationPrice.locationId);
                if (location) {
                    if (!location.locationPrices) {
                        location.locationPrices = [];
                    }
                    location.locationPrices.push(locationPrice);
                }
            })
           
            // get valid storages for date range, createdAt acts as valid from
            const storageQuery: string = `
          	    -- Storages that are valid on start date
		        SELECT "s"."storageId", "s"."palletAmount", "s"."createdAt", "s"."locationId", "s"."productId"
		        FROM "storage" "s"
		        WHERE ("s"."locationId", "s"."productId", "s"."createdAt") IN (
    		        SELECT "s2"."locationId", "s2"."productId", MAX("s2"."createdAt")
    		        FROM "storage" "s2"
    		        WHERE "s2"."createdAt" <= :startDate
    		        AND "s2"."locationId" IN (:locationIds)
    		        GROUP BY "s2"."locationId", "s2"."productId"
		        )
	
		        UNION

		        -- Storage changes within the date range
		        SELECT "s"."storageId", "s"."palletAmount", "s"."createdAt", "s"."locationId", "s"."productId"
		        FROM "storage" "s"
		        WHERE "s"."createdAt" >= :startDate
		        AND "s"."createdAt" < :endDate
		        AND "s"."locationId" IN (:locationIds);
	        `

            // use date after end date to get storages where createdAt is before midnight on end date
            let d: Date = new Date(endDate)
            d.setDate(d.getDate() + 1)

            const storages: Storage[] = await sequelize.query(storageQuery, {
                replacements: { locationIds: locationIds, startDate: startDate, endDate: d  },
                type: QueryTypes.SELECT
            })

            // add prices to their respective locations
            storages.forEach(storage => {
                const location = locations.find(location => location.locationId === storage.locationId);
                if (location) {
                    if (!location.storages) {
                        location.storages = [];
                    }
                    location.storages.push(storage);
                }
            })

            // go through all locations
            const locationReportPromises = locations.map(async (location) => {

                // create a daily report for each date
                let dailyReports: DailyReport[] = await createDailyReports(startDate, endDate, location)

                // calculate total cost for the location
                const totalCost = parseFloat(dailyReports.reduce((total, report) => total + report.totalDailyCost, 0).toFixed(2))

                // create location report
                const locationReport: LocationReport = {
                    location: location,
                    dailyReports: dailyReports,
                    totalCost: totalCost
                }
                
                return locationReport
            })

            const locationReports: LocationReport[] = await Promise.all(locationReportPromises)

            // create return report
            const report: Report = {
                locationReports: locationReports
            }

            return report
        }
    }
}