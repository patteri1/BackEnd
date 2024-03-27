import { Storage, Product, Location, Order, OrderRow } from '../model'
import { Op } from "sequelize"
import { sequelize } from "../util/db"

export const typeDef = `
    extend type Query {
        allStorages: [Storage]
        availableStorages: [Storage]
    } 

    extend type Mutation {
        setAmountToStorage(locationId: Int!, productId: Int!, palletAmount: Int!): Storage
        addPallets(storageInput: StorageInput!): Storage
    }

    type Storage {
        storageId: Int!
        locationId: Int!
        productId: Int!
        palletAmount: Int!
        product: Product!
        createdAt: String
    }

    input StorageInput {
        storageRows: [StorageRowInput]!
    }

    input StorageRowInput {
        locationId: Int!
        productId: Int!
        palletAmount: Int!
    }
`

interface StorageInput {
    storageRows: [StorageRowInput]
}

interface StorageRowInput {
    locationId: number
    productId: number
    palletAmount: number
}

export const resolvers = {
    Query: {
        allStorages: async () => {
            try {
                const allStorages = await Storage.findAll({ include: Product })
                return allStorages
            } catch (error) {
                console.log(error)
                throw new Error('Error retrieving all storages')
            }
        },
        // storages available for ordering
        availableStorages: async () => {
            try {
                // get current storages in käsittelylaitos
                const storages = await Storage.findAll({
                    include: [
                        {
                            model: Location, 
                            where: { locationType: 'Käsittelylaitos' }
                        },
                        Product, 
                    ],
                    where: {
                        createdAt: {
                            [Op.in]: sequelize.literal(`(
                                SELECT MAX("createdAt") 
                                FROM "storage" s
                                JOIN location l ON s."locationId" = l."locationId"
                                WHERE l."locationType" = 'Käsittelylaitos'
                                GROUP BY "productId"
                             )`)
                        },
                    },
                },
                )

                // get open order rows
                const orderRows = await OrderRow.findAll({
                    include: [
                        {
                            model: Order,
                            attributes: ['status'],
                            where: { 
                                status: 'Avattu' 
                            },
                        },
                        Product,
                    ],
                })

                // storages - orders = available pallets
                const availableStorages = storages.map(storage => {
                    const rows = orderRows.filter(row => row.productId === storage.productId)
                    const amount = rows.reduce((total, row) => total + row.palletAmount, 0)
                    return {
                        ...storage,
                        palletAmount: storage.palletAmount - amount
                    }
                })
                
                return availableStorages

            } catch (error) {
                console.log(error)
                throw new Error(`Error retrieving available pallets: ${error}`)
            }
        }
    },
    Mutation: {
        setAmountToStorage: async (_: unknown, args: { locationId: number, productId: number, palletAmount: number }) => {
            try {
                console.log('Updating palletAmount in storage for Location ID:', args.locationId, 'and Product ID:', args.productId);

                // todo fix: this is probably very broken due to db changes.

                // redo or make a new one

                const storage = await Storage.findOne({
                    where: {
                        locationId: args.locationId,
                        productId: args.productId,
                    },
                });

                if (!storage) {
                    throw new Error(`Storage with Location ID ${args.locationId} and Product ID ${args.productId} not found`);
                }

                storage.palletAmount = args.palletAmount;
                await storage.save();

                console.log('Successfully updated palletAmount in storage:', storage);

                return storage;
            } catch (error) {
                console.error(error);
                throw new Error(`Error updating palletAmount in storage for Location ID ${args.locationId} and Product ID ${args.productId}`);
            }
        },
        addPallets: async (_: unknown, { storageInput }: { storageInput: StorageInput }) => {
            try {
                // get current storages
                const storages = await Storage.findAll({
                    include: [
                        Location,
                        Product, 
                    ],
                    where: {
                        createdAt: {
                            [Op.in]: sequelize.literal(`(
                                SELECT MAX("createdAt") 
                                FROM "storage" s
                                WHERE "locationId" = :locationId
                                GROUP BY "productId"
                            )`)
                        },
                    },
                    replacements: { locationId: storageInput.storageRows[0].locationId },
                },
                )

                // add rows (palletAmounts: current + input)
                const rows = storageInput.storageRows.map((row) => {
                    const storage = storages.find(storage => storage.productId === row.productId)
                    return {
                        locationId: storageInput.storageRows[0].locationId,
                        productId: row.productId,
                        palletAmount: storage?.palletAmount ? storage.palletAmount + row.palletAmount : row.palletAmount
                    }
                })
                Storage.bulkCreate(rows)

                return rows[0] // (todo fix: return all rows)

            } catch (error) {
                console.log(error)
                throw new Error(`Error: addPallets`);
            }
        }

    }

}


