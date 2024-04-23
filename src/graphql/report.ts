import { Location, LocationPrice, Product, Storage } from '../model';
import { createDailyReports } from './util/reportUtils';
import { sequelize } from '../util/db';
import { Op, QueryTypes } from 'sequelize';
import { validLocationPricesForDateRange, validStoragesForDateRange } from './util/db_queries';

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
        price: Float!
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
    price: number
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
        report: async (_: unknown, args: { input: ReportInput }, context: { user?: any }): Promise<Report> => {
            // check that the user has the admin role
			// TODO: This could be improved
		    // if (!context.user || context.user.userRoleId !== 1) { 
            //      throw new Error('Invalid token');
            // }

            const startDate: Date = new Date(args.input.startDate)
            const endDate: Date = new Date(args.input.endDate)

            // Validate dates
            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                throw new Error('Invalid date format');
            }

            if (startDate > endDate) {
                throw new Error('Start date cannot be later than end date');
            }

            // Fetch locations specified in the query by id
            const { locationIds } = args.input
            const locations: Location[] = await Location.findAll({
                where: {
                    locationId: {
                        [Op.in]: locationIds
                    }
                },
            });

            // get valid prices
            const locationPrices: LocationPrice[] = await sequelize.query(validLocationPricesForDateRange, {
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
           
            // use date after end date to get storages where createdAt is before midnight on end date
            let d: Date = new Date(endDate)
            d.setDate(d.getDate() + 1)

            // get valid storages
            const storages: Storage[] = await sequelize.query(validStoragesForDateRange, {
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
                const totalCost = dailyReports.reduce((total, report) => total + report.totalDailyCost, 0)

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