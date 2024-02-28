import { Location } from "../model";
import { Storage } from '../model/Storage'
import { PalletType } from '../model/PalletType';

export const typeDef = `
    extend type Query {
        location(id: Int!): Location
        allLocations: [Location]
        allStorages: [Storage]
        allPalletTypes: [PalletType]
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

export const resolvers = {
    Query: {
        location: async (_: unknown, args: { id: number }) => {
            const { id } = args

            try {
                const location = await Location.findByPk(id, {include: [{
                    model: Storage,
                    include: [PalletType]
                }]}) 
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
        allLocations: async () =>  { 
            try {
                const allLocations = await Location.findAll({include: [{
                    model: Storage,
                    include: [PalletType],
            }]})

                return allLocations

            } catch (error) {
                console.log(error)
                throw new Error('Error retrieving all locations ')
            }
        },
    },
    Mutation: {

        } 
    };
