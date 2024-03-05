import { makeExecutableSchema } from '@graphql-tools/schema'
import { merge } from 'lodash' // to merge resolver strings easier

import { typeDef as Location, resolvers as locationResolvers } from './location'
import { typeDef as User, resolvers as userResolvers } from './user'
import { typeDef as Order, resolvers as orderResolvers } from './order'
import { typeDef as Storage, resolvers as storageResolvers } from './storage'
import { typeDef as PalletType, resolvers as palletTypeResolvers } from './palletType'

// this is extended, fake empty field added as you cannot have an empty type
const Query = `
    type Query {
        locations: [Location]
        location(id: ID): Location
        storages: [Storage]
    }
`
const Mutation = `
  type Mutation {
    setAmountToStorage(locationId: Int!, palletTypeId: Int!, amount: Int!): Storage
    setAmountForPalletType(palletTypeId: Int!, amount: Int!): PalletType
    addPalletTypeToLocation(locationId: Int!, palletTypeId: Int!, amount: Int!): Storage
  }
`


// resolvers from other files are merged to this
const resolvers = {
  Query: {},
  Mutation: {}

}

// put everything together and make the schema
export const schema = makeExecutableSchema({
  typeDefs: [Query, Mutation, Location, User, Order, Storage, PalletType],
  resolvers: merge(resolvers, locationResolvers, userResolvers, orderResolvers, storageResolvers, palletTypeResolvers),
})
