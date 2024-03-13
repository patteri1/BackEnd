import { Storage } from '../model/Storage'
import { PalletType } from '../model/PalletType';
import { Location } from '../model';

export const typeDef = `
    extend type Query {
        allStorages: [Storage]
        availableStorages: [Storage]
    } 

    type Storage {
        locationId: Int!
        palletTypeId: Int!
        amount: Int!
        palletType: PalletType!
    }

    extend type Mutation {
        setAmountToStorage(locationId: Int!, palletTypeId: Int!, amount: Int!): Storage
    }
`

export const resolvers = {
    Query: {
        allStorages: async () => {
            try {
                const allStorages = await Storage.findAll({ include: PalletType })
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
                        PalletType, 
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
        setAmountToStorage: async (_: unknown, args: { locationId: number, palletTypeId: number, amount: number }) => {
            try {
                console.log('Updating amount in storage for Location ID:', args.locationId, 'and PalletType ID:', args.palletTypeId);

                const storage = await Storage.findOne({
                    where: {
                        locationId: args.locationId,
                        palletTypeId: args.palletTypeId,
                    },
                });

                if (!storage) {
                    throw new Error(`Storage with Location ID ${args.locationId} and PalletType ID ${args.palletTypeId} not found`);
                }

                storage.amount = args.amount;
                await storage.save();

                console.log('Successfully updated amount in storage:', storage);

                return storage;
            } catch (error) {
                console.error(error);
                throw new Error(`Error updating amount in storage for Location ID ${args.locationId} and PalletType ID ${args.palletTypeId}`);
            }
        },
    }

}


