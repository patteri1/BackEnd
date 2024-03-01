import { Location } from "../model";

export const typeDef: string = `
    extend type Query {
        report(input: ReportInput!): Report!
    }

    input ReportInput {
        startTime: String!
        endTime: String!
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
        product: String!
        palletAmount: Int!
        totalCost: Int!
    }
`

interface ReportInput {
    startTime: string
    endTime: string
    locationIds: number[]
}

interface Report {
    locationReports: LocationReport[]
}

interface LocationReport {
    location: Location
    dailyReports: DailyReport[]
    totalCost: number
}

interface DailyReport {
    date: string
    productReports: ProductReport[]
    totalDailyPallets: number
    totalDailyCost: number
}

interface ProductReport {
    product: string
    palletAmount: number
    totalCost: number
}
  
export const resolvers = {
    Query: {
        report: async (_: unknown, args: { input: ReportInput }): Promise<Report> => {

            const report: Report = {
                locationReports: []
            }

            return report
        }
    }
}