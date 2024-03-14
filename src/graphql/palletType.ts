import { PalletType } from '../model/PalletType';

export const typeDef = `
    extend type Query {
        allPalletTypes: [PalletType]
    } 

    type PalletType {
        palletTypeId: Int!
        productName: String
        productAmount: Int!
        storages: [Storage]!
    }
`
export const resolvers = {
    Query: {
        allPalletTypes: async () => {
            try {
                const allPalletTypes = await PalletType.findAll()
                return allPalletTypes
            } catch (error) {
                console.log(error)
                throw new Error('error')
            }
        },
    },
};