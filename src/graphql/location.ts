import { Location} from '../model/Location'
import { Storage } from '../model/Storage'
import { PalletType } from '../model/PalletType';




export const typeDef = `
    extend type Query {
        location(id: Int!): Location
        allLocations: [Location]
        allStorages: [Storage]
    } 
 
    type Location {
        id: Int!
        name: String!
        address: String!
        postalCode: String!
        city: String!
        price: Float!
        storages: [Storage]!
    }

    type Storage {
        locationId: Int!
        amount: Int!
        palletTypes: [PalletType!]
    }

    type PalletType {
        palletTypeId: Int!
        locationId: Int!
        product: String
        amount: Int!
    }

    type Mutation {
        addAmountToStorage(locationId: Int!, amount: Int!): Storage
        deleteAmountFromStorage(locationId: Int!, amount: Int!): Storage
    }
`;

export const resolvers = {
    Query: {
        location: async (_: unknown, args: { id: number }) => {
            const { id } = args

            try {
                const location = await Location.findByPk(id, {include: 'storages'}) 
                if (!location) {
                    throw new Error(`Location with ID ${id} not found`)
                }

                return location;

            } catch (error) {
                console.log(error);
                throw new Error(`Error retrieving location with ID ${id}`)
            }
        },
        // get all locations
        allLocations: async () =>  { 
            try {
                const allLocations = await Location.findAll({include: [{
                    model: Storage,
                    include: [PalletType]
            }]})

                return allLocations

            } catch (error) {
                console.log(error)
                throw new Error('Error retrieving all locations ')
            }
        },

        allStorages:async () => {
            try{
                const allStorages = await Storage.findAll({include: PalletType})
                return allStorages
            } catch(error) {
                console.log(error)
                throw new Error('Error retrieving all storages')
            }
        }
    },
    Mutation: {
        addAmountToStorage: async (_: unknown, args: {locationId: number, amount: number}) => {
            try{
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
            deleteAmountFromStorage: async (_: unknown, args: {locationId: number, amount: number}) => {
                try{
                    const storage = await Storage.findByPk(args.locationId)
                    if (!storage) {
                        throw new Error(`Storage with ID ${args.locationId} not found`)
                    }
                    storage.amount -= args.amount
                    await storage.save()
                    return storage
                } catch (error){
                    console.log(error)
                    throw new Error(`Error deleting amount from storage with ID ${args.locationId}`)
                }
            },
            addToPallet: async (_: unknown, args: {palletTypeId: number, amount: number}) => {
                try{
                    const pallet = await PalletType.findByPk(args.palletTypeId)
                    if (!pallet) {
                        throw new Error(`Pallet with ID ${args.palletTypeId} not found`)
                    }
                    pallet.amount += args.amount
                    await pallet.save()
                    return pallet
                }catch (error){
                    console.log(error)
                    throw new Error(`Error adding amount to pallet with ID ${args.palletTypeId}`)
                }
            }
        } 
    };
