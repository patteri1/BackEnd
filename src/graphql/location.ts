import { Location } from "../model";

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
    }
`

export const resolvers = {
    Query: {
        // get location by ID
        location: async (_: unknown, args: { id: number }) => {
            const { id } = args

            try {
                const location = await Location.findByPk(id); // Use findByPk to find the location by its primary key (id)
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
                const allLocations = await Location.findAll()

                return allLocations

            } catch (error) {
                console.log(error)
                throw new Error('Error retrieving all locations ')
            }
        },
    },
}