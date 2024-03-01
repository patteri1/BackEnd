import { Storage } from '../model/Storage'
import { PalletType } from '../model/PalletType';

export const typeDef = `
    extend type Query {
        allStorages: [Storage]
    } 

    type Storage {
        locationId: Int!
        palletTypeId: Int!
        amount: Int!
        palletType: PalletType!
    }

    extend type Mutation {
        addAmountToStorage(locationId: Int!, amount: Int!): Storage
        deleteAmountFromStorage(locationId: Int!, amount: Int!): Storage
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
    },
    Mutation: {
        addAmountToStorage: async (_: unknown, args: { locationId: number, amount: number }) => {
            try {
                const storage = await Storage.findByPk(args.locationId)
                if (!storage) {
                    throw new Error(`Storage with ID ${args.locationId} not found`)
                }

                storage.amount += args.amount
                await storage.save()

                return storage;
            } catch (error) {
                console.error(error)
                throw new Error(`Error adding amount to storage with ID ${args.locationId}`)
            }
        },
        deleteAmountFromStorage: async (_: unknown, args: { locationId: number, amount: number }) => {
            try {
                const storage = await Storage.findByPk(args.locationId)
                if (!storage) {
                    throw new Error(`Storage with ID ${args.locationId} not found`)
                }

                storage.amount -= args.amount
                await storage.save()
                return storage
            } catch (error) {
                console.log(error)
                throw new Error(`Error deleting amount from storage with ID ${args.locationId}`)
            }
        },
    }

}


