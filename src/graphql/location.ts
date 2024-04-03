import { group } from "console"
import { Location, Storage, Product, LocationPrice } from "../model"
import { Op, QueryTypes, where } from "sequelize"
import { sequelize } from "../util/db"

export const typeDef = `
    extend type Query {
        location(locationId: Int!): Location
        allLocations: [Location]
        locationsWithStorages(locationIds: [Int!]!): [Location]
    } 

    extend type Mutation {
        deleteLocation(id: Int!): Location
        addLocation(location: LocationInput!): Location
        updateLocation(locationId: Int!, input: LocationInput!): Location
        addStorageToLocation(locationId: Int!, productId: Int!, palletAmount: Int!): Location
    }
 
    type Location {
        locationId: Int!
        locationName: String!
        address: String!
        postCode: String!
        city: String!
        locationType: String!
        locationPrices: [LocationPrice]!
        storages: [Storage]!
    }

    input LocationInput {
        locationName: String
        address: String
        postCode: String
        city: String
        locationType: String
    }


    type LocationPrice {
        locationPriceId: Int!
        locationId: Int!
        price: Float!
        validFrom: String!
    }

`

interface UpdateLocationArgs {
    locationId: number
    input: LocationInput
}

interface LocationInput {
    locationName?: string
    address?: string
    postCode?: string
    city?: string
    locationType?: string

}

export const resolvers = {
    Query: {
        location: async (_: unknown, args: { locationId: number }) => {
            const { locationId } = args

            try {
                const location = await Location.findByPk(locationId, {
                    include: [{
                        model: Storage,
                        include: [Product]
                    }]
                })
                if (!location) {
                    throw new Error(`Location with ID ${locationId} not found`)
                }

                return location

            } catch (error) {
                console.log(error)
                throw new Error(`Error retrieving location with ID ${locationId}`)
            }
        },

        // get all locations
        allLocations: async () => {
            try {
                const allLocations = await Location.findAll({
                    include: [{
                        model: Storage,
                        include: [Product],
                    }]
                })

                return allLocations

            } catch (error) {
                console.log(error)
                throw new Error('Error retrieving all locations ')
            }
        },

        locationsWithStorages: async (_: unknown, args: { locationIds: number[] }): Promise<Location[]> => {
            const currentDate = new Date();
            const { locationIds } = args
            console.log(locationIds)
            if (!Array.isArray(locationIds) || locationIds.length === 0) {
                throw new Error('Invalid input: locationIds must be a non-empty array.');
            }

            try {
                const locations: Location[] = await Location.findAll({
                    where: {
                        locationId: {
                            [Op.in]: locationIds
                        }
                    },
                    include: [{
                        model: LocationPrice,
                        attributes: ['price', 'validFrom'],
                        where: {
                            validFrom: {
                                [Op.lte]: currentDate
                            }
                        },
                        order: [['validFrom', 'DESC']],
                        limit: 1,
                    }],
                });

                const storageQuery = `WITH ranked_storages AS (
                    SELECT "s"."storageId", "s"."palletAmount", "s"."createdAt", "s"."locationId", "s"."productId",
                           ROW_NUMBER() OVER(PARTITION BY "s"."locationId", "s"."productId" ORDER BY "s"."createdAt" DESC) as rn
                    FROM "storage" "s"
                    WHERE ("s"."locationId", "s"."productId", "s"."createdAt") IN (
                        SELECT "s2"."locationId", "s2"."productId", MAX("s2"."createdAt")
                        FROM "storage" "s2"
                        WHERE "s2"."createdAt" <= :startDate 
                        AND "s2"."locationId" IN (:locationIds) 
                        GROUP BY "s2"."locationId", "s2"."productId"
                    )
                )
                SELECT "storageId", "palletAmount", "createdAt", "locationId", "r"."productId", "productName"
                FROM ranked_storages "r"
                JOIN product "p" ON "r". "productId" = "p"."productId"
                WHERE rn = 1;`;


                const storages: Storage[] = await sequelize.query(storageQuery, {
                    replacements: { locationIds: locationIds, startDate: currentDate },
                    type: QueryTypes.SELECT,
                })
                const productIds = storages.map(storage => storage.productId)
                // Retrieve products corresponding to the productIds
                const products: Product[] = await Product.findAll({
                    where: {
                        productId: {
                            [Op.in]: productIds
                        }
                    }
                });

                storages.forEach(storage => {
                    const location = locations.find(location => location.locationId === storage.locationId);
                    if (location) {
                        if (!location.storages) {
                            location.storages = []
                        }
                        location.storages.push(storage)


                    }
                })

                console.log(locations, storages, products)

                return locations;

            } catch (error) {
                console.log(error);
                throw new Error(`Error retrieving locations`)
            }
        }

    },
    Mutation: {
        addLocation: async (_: unknown, location: LocationInput) => {
            try {
                const newLocation = await Location.create(location as Partial<Location>)
                return newLocation
            } catch (error) {
                throw new Error(`Unable to add location: ${error}`)
            }
        },
        deleteLocation: async (_: unknown, { id }: { id: number }) => {
            try {
                const locationToDelete = await Location.findByPk(id)

                if (!locationToDelete) {
                    throw new Error(`Location with id: ${id} not found`)
                }

                await locationToDelete.destroy()
                return locationToDelete

            } catch (error) {
                throw new Error(`Unable to delete location by id: ${id}`)
            }
        },
        updateLocation: async (_: unknown, { locationId, input }: UpdateLocationArgs): Promise<Location> => {
            try {
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
        addStorageToLocation: async (_: unknown, args: { locationId: number, productId: number, palletAmount: number }) => {
            try {
                const location = await Location.findByPk(args.locationId);
                const product = await Product.findByPk(args.productId);

                if (!location || !product) {
                    throw new Error(`Location or Product not found`);
                }

                const existingStorage = await Storage.findOne({
                    where: {
                        locationId: args.locationId,
                        productId: args.productId,
                    },
                });

                if (existingStorage) {
                    throw new Error(`Product already exists for this Location`);
                }

                const newStorage = await Storage.create({
                    locationId: args.locationId,
                    productId: args.productId,
                    palletAmount: args.palletAmount,
                });

                return newStorage;
            } catch (error) {
                console.error(error);
                throw new Error(`Error adding Storage to Location`);
            }
        },

    }

};
