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
        setAmountForPalletType: async (_: unknown, args: { palletTypeId: number, amount: number }) => {
            try {
                const palletType = await PalletType.findByPk(args.palletTypeId)
                if (!palletType) {
                    throw new Error(`PalletType with ID ${args.palletTypeId} not found`)
                }
                palletType.amount = args.amount
                await palletType.save()


                return palletType
            } catch (error) {
                console.error(error)
                throw new Error(`Error adding amount for palletType ${args.palletTypeId}`)
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
