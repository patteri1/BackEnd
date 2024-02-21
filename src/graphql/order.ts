import { Op } from 'sequelize'
import { Order, OrderRow } from '../model/'

export const typeDef = `
    extend type Query {
        order(id: Int!): Order
        allOrders: [Order]
        openOrders: [Order]
        closedOrders: [Order]
    }

    type Order {
        orderId: Int!
        location: Location!
        datetime: String
        status: String
        orderRows: [OrderRow]
    }

    type OrderRow {
        order: Order!
        palletType: PalletType!
        amount: Int!
    }

    type PalletType {
        palletTypeId: Int!
        product: String
        amount: Int!
    }
`

export const resolvers = {
    Query: {
        // get order by id
        order: async (_: unknown, args: { id: number }) => {
            const { id } = args

            try {
                const order = await Order.findByPk(id, {
                    include: [
                        'location', 
                        {
                            model: OrderRow, 
                            where: { orderId: id }, 
                            include: ['palletType']
                        }
                    ]
                })
                if (!order) {
                    throw new Error(`Order with ID ${id} not found`)
                }

                return order

            } catch (error) {
                console.log(error);
                throw new Error(`Error retrieving order with ID ${id}`)
            }
        },
        // get all orders (without rows)
        allOrders: async () =>  { 
            try {
                const allOrders = await Order.findAll({
                    include: 'location'
                })

                return allOrders

            } catch (error) {
                console.log(error)
                throw new Error('Error retrieving all orders ')
            }
        },
        // get all open orders (status Avattu)
        openOrders: async () =>  { 
            try {
                const orders = await Order.findAll({
                    include: 'location', 
                    where: { 
                        status: 'Avattu' 
                    }
                })

                return orders

            } catch (error) {
                console.log(error)
                throw new Error('Error retrieving open orders')
            }
        },
        // get all closed orders (status Noudettu/Peruttu)
        closedOrders: async () =>  { 
            try {
                const orders = await Order.findAll({
                    include: 'location', 
                    where: { 
                        status: {
                            [Op.or]: ['Noudettu', 'Peruttu']
                        } 
                    }
                })

                return orders

            } catch (error) {
                console.log(error)
                throw new Error('Error retrieving open orders')
            }
        }
    }
}