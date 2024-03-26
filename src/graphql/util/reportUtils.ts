import { DailyReport, ProductReport } from "../report";
import { Location, Product, LocationPrice, Storage } from "../../model";

export async function createDailyReports(startDate: Date, endDate: Date, location: Location): Promise<DailyReport[]> {
    let dailyReports: DailyReport[] = [];
    
    // get all different products
    const products: Product[] = await Product.findAll()

    // create a daily report for reach date in the given range
    for(let d: Date = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {

        let currentValidLocationPrice: LocationPrice = location.locationPrices[0]
        let i: number = 1 // index for next price

        // change the currentValidPrice if there is a new valid price for this date d
        if(i < location.locationPrices.length && d >= location.locationPrices[i].validFrom){
            currentValidLocationPrice = location.locationPrices[i]
        }

        // get product reports
        const productReports: ProductReport[] = await createProductReports(location, d, products, currentValidLocationPrice.price)
        
        // calculate daily pallets and cost
        const totalDailyPallets = productReports.reduce((total, report) => total + report.palletAmount, 0);
        const totalDailyCost = productReports.reduce((total, report) => total + report.cost, 0);

        const dailyReport: DailyReport = {
            date: d.toISOString(),
            productReports: productReports,
            totalDailyPallets: totalDailyPallets,
            totalDailyCost: parseFloat(totalDailyCost.toFixed(2)),
        }
        dailyReports.push(dailyReport)
    }

    return dailyReports
}

async function createProductReports(location: Location, date: Date, products: Product[], price: number): Promise<ProductReport[]> {
    let productReports: ProductReport[] = []

    // create a product report for each pallet type (product)
    products.map((product: Product) => {

        // get the storage data for the product
        const productStorageData: Storage[] = location.storages.filter((storage) => storage.productId === product.productId)

        // get the valid storage for this date, storages need to be in desc order so we get the latest valid one with .find()
        const storagesDesc: Storage[] = productStorageData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        const validStorage: Storage | undefined = storagesDesc.find((storage) => storage.createdAt < date)
        
        const amount: number = validStorage ? validStorage.palletAmount : 0
        const cost: number = amount * (price / 30)

        const productReport: ProductReport = {
            product: product,
            palletAmount: amount,
            cost: parseFloat(cost.toFixed(2)),
        }

        productReports.push(productReport)
    })

    return productReports
}

