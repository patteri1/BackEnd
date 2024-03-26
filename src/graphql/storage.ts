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
        setAmountToStorage: async (_: unknown, args: { locationId: number, productId: number, palletAmount: number }) => {
            try {
                console.log('Updating palletAmount in storage for Location ID:', args.locationId, 'and Product ID:', args.productId);

                // todo fix: this is probably very broken due to db changes.

                // add a condition? 
                // if a storage row for the wanted product and current date (createdAt)
                // already exists, use storage.save(), if not, use storage.create()

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


