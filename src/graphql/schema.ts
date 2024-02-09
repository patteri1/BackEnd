import { makeExecutableSchema } from '@graphql-tools/schema'
import { merge } from 'lodash' // to merge resolver strings easier

import { typeDef as Location, resolvers as locationResolvers } from './location'
import { Storage } from '../model/Storage';

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
    addAmountToStorage(locationId: Int!, amount: Int!): Storage
    deleteAmountFromStorage(locationId: Int!, amount: Int!): Storage
  }
`;

// resolvers from other files are merged to this
const resolvers = {
    Query: {},
    Mutation: {}
    
}

// put everything together and make the schema
export const schema = makeExecutableSchema({
    typeDefs: [Mutation, Query, Location],
    resolvers: merge(resolvers, locationResolvers),
})
