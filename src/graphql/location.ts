import { Location} from '../model/Location'
import { Storage } from '../model/Storage'


export const typeDef = `
    extend type Query {
        location(id: Int!): Location
        allLocations: [Location]
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
    }

    type Mutation {
        addAmountToStorage(locationId: Int!, amount: Int!): Storage
        deleteAmountFromStorage(locationId: Int!, amount: Int!): Storage
    }
`;

export const resolvers = {
    Query: {
        // get location by ID
        location: async (_: unknown, args: { id: number }) => {
            const { id } = args

            try {
                const location = await Location.findByPk(id, {include: 'storages'}); // Use findByPk to find the location by its primary key (id)
                if (!location) {
                    throw new Error(`Location with ID ${id} not found`);
                }

                return location;

            } catch (error) {
                console.log(error);
                throw new Error(`Error retrieving location with ID ${id}`);
            }
        },
        // get all locations
        allLocations: async () =>  { 
            try {
                const allLocations = await Location.findAll({include: 'storages'})

                return allLocations

            } catch (error) {
                console.log(error)
                throw new Error('Error retrieving all locations ')
            }
        },
    },
    Mutation: {
        addAmountToStorage: async ({ locationId, amount}: { locationId: number, amount: number }) => {
            try{
                const storage = await Storage.findByPk(locationId);
                if (!storage) {
                    throw new Error(`Storage with ID ${locationId} not found`);
                }

                // Assuming 'amount' is a field in your Storage model
                storage.amount += amount;

                // Save the updated storage
                await storage.save();

                return storage;
            } catch (error) {
                console.error(error);
                throw new Error(`Error adding amount to storage with ID ${locationId}`);
            }
            },
            deleteAmountFromStorage: async ({ locationId, amount }: { locationId: number, amount: number }) => {
                try{
                    const storage = await Storage.findByPk(locationId);
                    if (!storage) {
                        throw new Error(`Storage with ID ${locationId} not found`);
                    }
                    storage.amount -= amount;
                    await storage.save();
                    return storage;
                } catch (error){
                    console.error(error);
                    throw new Error(`Error deleting amount from storage with ID ${locationId}`);
                }
            }
        } 
    };
