import { Op } from 'sequelize'
import { Location, LocationPrice, PalletType, Storage } from '../model';
import { createDailyReports } from './util/reportUtils';

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
        totalCost: Int!
    }

    type DailyReport {
        date: String!
        productReports: [ProductReport]
        totalDailyPallets: Int!
        totalDailyCost: Int!
    }

    type ProductReport {
        product: PalletType!
        palletAmount: Int!
        cost: Int!
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
    product: PalletType
    palletAmount: number
    cost: number
}

export const resolvers = {
    Query: {
        report: async (_: unknown, args: { input: ReportInput }): Promise<Report> => {

            // fetch matching ids specified in the query
            const { locationIds } = args.input
            const locations: Location[] = await Location.findAll({
                where: {
                    id: {
                        [Op.in]: locationIds
                    }
                },
                include: [
                    {
                        model: LocationPrice,
                    },
                    {
                        model: Storage,
                        include: [PalletType]
                    }
                ]
            })

            const startDate: Date = new Date(args.input.startDate)
            const endDate: Date = new Date(args.input.endDate)

            // go through all locations
            const locationReportPromises = locations.map(async (location) => {

                // create a daily report for each date
                let dailyReports: DailyReport[] = await createDailyReports(startDate, endDate, location)

                // calculate total cost for the location
                const totalCost = dailyReports.reduce((total, report) => total + report.totalDailyCost, 0);

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