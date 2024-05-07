import { Product } from '../model/Product'
import { MyContext } from './context'
import { checkHasRole } from './util/authorizationChecks'

export const typeDef = `
    extend type Query {
        allProducts: [Product]
    } 

    type Product {
        productId: Int!
        productName: String
        productAmount: Int!
        storages: [Storage]!
    }
`
export const resolvers = {
    Query: {
        allProducts: async (_: unknown, __: unknown, context: MyContext) => {
            checkHasRole(context)
            try {
                const allProducts = await Product.findAll()
                return allProducts
            } catch (error) {
                console.log(error)
                throw new Error('error')
            }
        },
    },
}