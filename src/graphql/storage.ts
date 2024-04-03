import { Storage } from '../model/Storage'
import { Product } from '../model/Product';

export const typeDef = `
    extend type Query {
        allStorages: [Storage]
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
    },
    Mutation: {
        setAmountToStorage: async (_: unknown, args: { locationId: number, productId: number, palletAmount: number, createdAt: string }) => {
            try {
                console.log('Updating palletAmount in storage for Location ID:', args.locationId, 'and Product ID:', args.productId);

                // Check if the storage row for the wanted product and createdAt already exists
                const storage = await Storage.findOne({
                    where: {
                        locationId: args.locationId,
                        productId: args.productId,
                        createdAt: args.createdAt // Add the condition for createdAt
                    },
                });

                if (!storage) {
                    throw new Error(`Storage with Location ID ${args.locationId}, Product ID ${args.productId}, and Created At ${args.createdAt} not found`);
                }

                storage.palletAmount = args.palletAmount;
                await storage.save();

                console.log('Successfully updated palletAmount in storage:', storage);

                return storage;
            } catch (error) {
                console.error(error);
                throw new Error(`Error updating palletAmount in storage for Location ID ${args.locationId}, Product ID ${args.productId}, and Created At ${args.createdAt}`);
            }
        },
    }


}


