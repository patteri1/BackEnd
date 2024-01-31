import { Location } from '../model/Location'
import { Storage } from '../model/Storage'

export const typeDef = `
    extend type Query {
        location(id: Int!): Location
        allLocations: [Location]
    } 

    type Storage {
        id: Int!
        name: String!
        locationId: Int!
    }
    
    type Location {
        id: Int!
        name: String!
        address: String!
        postalCode: String!
        city: String!
        price: Float!
        storage: [Storage]!
    }
`

export const resolvers = {
    Query: {
        // get location by ID
        location: async (_: unknown, args: { id: number }) => {
            const { id } = args

            try {
                const location = await Location.findByPk(id, {include: 'storage'}); // Use findByPk to find the location by its primary key (id)
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
                const allLocations = await Location.findAll({include: 'storage'})

                return allLocations

            } catch (error) {
                console.log(error)
                throw new Error('Error retrieving all locations ')
            }
        },
    },
}