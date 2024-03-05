import { Op } from 'sequelize'
import { Order, OrderRow } from '../model/'

export const typeDef = `
    extend type Query {
        order(id: Int!): Order
        allOrders: [Order]
        openOrders: [Order]
        closedOrders: [Order]
    }

    extend type Mutation {
        addOrder(input: AddOrderInput!): Order!
        collectOrder(id: Int!): Order
        cancelOrder(id: Int!): Order
    }

    type Order {
        orderId: Int!
        location: Location!
        createdAt: String
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

    input AddOrderInput {
        locationId: Int!
        status: String
        orderRows: [OrderRowInput]
    }

    input OrderRowInput {
        palletTypeId: Int!
        amount: Int!
    }
`

interface AddOrderInput {
    locationId: number
    status: string
    orderRows: OrderRowInput[]
}

interface OrderRowInput {
    palletTypeId: number
    amount: number
}

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
                throw new Error('Error retrieving closed orders')
            }
        }
    },
    Mutation: {
        addOrder: async (_: unknown, { input }: { input: AddOrderInput }) => {
            try {
                const { locationId, status, orderRows } = input
                const order: Order = await Order.create({
                    locationId: locationId,
                    status,
                })

                // add rows
                const rows = orderRows.map(rowInput => ({
                    orderId: order.orderId,
                    palletTypeId: rowInput.palletTypeId,
                    amount: rowInput.amount
                }))
                await OrderRow.bulkCreate(rows)

                // todo: reduce pallets from original location's storage

                return {
                    orderId: order.orderId,
                    location: {
                        id: locationId,
                        
                    },
                    createdAt: order.createdAt,
                    status: order.status,
                    orderRows: rows // todo fix: returns orderRows as null in Apollo, even though they get successfully saved in the db
                }

            } catch (error) {
                console.log(error)
                throw new Error('Error adding new order')
            }
        },
        // mark order as collected
        collectOrder: async (_: unknown, args: { id: number }) => {
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
                order.status = 'Noudettu'
                await order.save()

                // todo: add ordered pallets to new location's storage
                
                return order

            } catch (error) {
                console.log(error);
                throw new Error(`Error collecting order ${id}`)
            }
        },
        // mark order as cancelled
        cancelOrder: async (_: unknown, args: { id: number }) => {
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
                order.status = 'Peruttu'
                await order.save()

                // todo: return pallets to original location's storage
                
                return order

            } catch (error) {
                console.log(error);
                throw new Error(`Error cancelling order ${id}`)
            }
        }
    }
}