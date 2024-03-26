import { Storage, Product, Location } from '../model'


export const typeDef = `
    extend type Query {
        allStorages: [Storage]
        availableStorages: [Storage]
    } 

    type Storage {
        storageId: Int!
        locationId: Int!
        productId: Int!
        palletAmount: Int!
        product: Product!
        createdAt: String
    }

    extend type Mutation {
        setAmountToStorage(locationId: Int!, productId: Int!, palletAmount: Int!): Storage
    }
`

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
                const availableStorages = await Storage.findAll({
                    include: [
                        Product, 
                        {
                            model: Location, 
                            where: { locationType: 'Käsittelylaitos' }
                        }
                    ]
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
    }

}


