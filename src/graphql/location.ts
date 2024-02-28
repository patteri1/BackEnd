import { Location } from "../model";
import { Storage } from '../model'
import { PalletType } from '../model';

export const typeDef = `
    extend type Query {
        location(id: Int!): Location
        allLocations: [Location]
    } 

    input LocationInput {
        name: String
        address: String
        city: String
        postCode: String
        price: Float
        locationType: String
    }

    extend type Mutation {
        updateLocation(locationId: Int!, input: LocationInput!): Location
    }
 
    type Location {
        id: Int!
        name: String!
        address: String!
        city: String!
        postCode: String!
        price: Float!
        locationType: String!
        storages: [Storage]!
    }
`

interface UpdateLocationArgs {
    locationId: number
    input: LocationInput
}

interface LocationInput {
    name?: string
    address?: string
    city?: string
    postCode?: string
    price?: number
    locationType?: string
}

export const resolvers = {
    Query: {
        location: async (_: unknown, args: { id: number }) => {
            const { id } = args

            try {
                const location = await Location.findByPk(id, {
                    include: [{
                        model: Storage,
                        include: [PalletType]
                    }]
                })
                if (!location) {
                    throw new Error(`Location with ID ${id} not found`)
                }

                return location;

            } catch (error) {
                console.log(error)
                throw new Error(`Error retrieving location with ID ${id}`)
            }
        },

        // get all locations
        allLocations: async () => {
            try {
                const allLocations = await Location.findAll({
                    include: [{
                        model: Storage,
                        include: [PalletType],
                    }]
                })

                return allLocations

            } catch (error) {
                console.log(error)
                throw new Error('Error retrieving all locations ')
            }
        },
    },
    Mutation: {
        updateLocation: async (_: unknown, { locationId, input }: UpdateLocationArgs): Promise<Location> => {
            try {
                console.log(locationId)
                const locationToUpdate = await Location.findByPk(locationId)
                if (!locationToUpdate) {
                    throw new Error('Location not found')
                }
                Object.assign(locationToUpdate, input)
                await locationToUpdate.save();
                return locationToUpdate
            } catch (error) {
                if (error instanceof Error) {
                    throw new Error(`Failed to update location: ${error.message}`)
                } else {
                    throw new Error(`Failed to update location with ID ${locationId}: Unknown error`)
                }
            }
        },
    },

};
