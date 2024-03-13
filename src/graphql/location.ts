import { Location } from "../model";
import { Storage } from '../model'
import { PalletType } from '../model';

export const typeDef = `
    extend type Query {
        location(id: Int!): Location
        allLocations: [Location]
        carrierLocations: [Location]
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
        addStorageToLocation(locationId: Int!, palletTypeId: Int!, amount: Int!): Location
        
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
        // get all carriers
        carrierLocations: async () => {
            try {
                const carriers = await Location.findAll({
                    where: {locationType: 'Kuljetusliike'}
                })

                return carriers

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

        addStorageToLocation: async (_: unknown, args: { locationId: number, palletTypeId: number, amount: number }) => {
            try {
                const location = await Location.findByPk(args.locationId);
                const palletType = await PalletType.findByPk(args.palletTypeId);

                if (!location || !palletType) {
                    throw new Error(`Location or PalletType not found`);
                }

                const existingStorage = await Storage.findOne({
                    where: {
                        locationId: args.locationId,
                        palletTypeId: args.palletTypeId,
                    },
                });

                if (existingStorage) {
                    throw new Error(`PalletType already exists for this Location`);
                }

                const newStorage = await Storage.create({
                    locationId: args.locationId,
                    palletTypeId: args.palletTypeId,
                    amount: args.amount,
                });

                return newStorage;
            } catch (error) {
                console.error(error);
                throw new Error(`Error adding Storage to Location`);
            }
        },

    }
};
