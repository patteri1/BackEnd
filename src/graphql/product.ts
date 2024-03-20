import { Product } from '../model/Product'

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
        allProducts: async () => {
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