import { DailyReport, ProductReport } from "../report";
import { Location, PalletType } from "../../model";

export async function createDailyReports(startDate: Date, endDate: Date, location: Location): Promise<DailyReport[]> {
    let dailyReports: DailyReport[] = [];
    
    // get all pallet types (different products)
    const palletTypes: PalletType[] = await PalletType.findAll()

    

    // create a daily report for reach date in the given range
    for(let d: Date = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        
        // get product reports
        const productReports: ProductReport[] = await createProductReports(location, d, palletTypes)
        
        // calculate daily pallets and cost
        const totalDailyPallets = productReports.reduce((total, report) => total + report.palletAmount, 0);
        const totalDailyCost = productReports.reduce((total, report) => total + report.cost, 0);

        const dailyReport: DailyReport = {
            date: d.toISOString(),
            productReports: productReports,
            totalDailyPallets: totalDailyPallets,
            totalDailyCost: totalDailyCost,
        }
        dailyReports.push(dailyReport)
    }

    return dailyReports
}

async function createProductReports(location: Location, date: Date, palletTypes: PalletType[]): Promise<ProductReport[]> {
    let productReports: ProductReport[] = []

    // create a product report for each pallet type (product)
    palletTypes.map((palletType: PalletType) => {
        const productReport: ProductReport = {
            palletType: palletType,
            palletAmount: 5, // PLACEHOLDER
            cost: 25, // PLACEHOLDER
        }

        productReports.push(productReport)
    })

    return productReports
}