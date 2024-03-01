import { makeExecutableSchema } from '@graphql-tools/schema'
import { merge } from 'lodash' // to merge resolver strings easier

import { typeDef as Location, resolvers as locationResolvers } from './location'
import { typeDef as User, resolvers as userResolvers } from './user'
import { typeDef as Order, resolvers as orderResolvers } from './order'
import { typeDef as Report, resolvers as reportResolvers } from './report'

// this is extended, fake empty field added as you cannot have an empty type
const Query = `
    type Query {
      _empty: String
    }
`
const Mutation = `
  type Mutation {
    _empty: String
  }
`

// resolvers from other files are merged to this
const resolvers = {
    Query: {},
    Mutation: {}
    
}

// put everything together and make the schema
export const schema = makeExecutableSchema({
    typeDefs: [Query, Mutation, Location, User, Order, Report],
    resolvers: merge(resolvers, locationResolvers, userResolvers, orderResolvers, reportResolvers),
})
