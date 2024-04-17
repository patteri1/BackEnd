import { Location } from './Location'
import { Order } from './Order'
import { OrderRow } from './OrderRow'
import { Product } from './Product'
import { Storage } from './Storage'
import { UserRole } from "./UserRole"
import { User } from "./User"
import { LocationPrice } from './LocationPrice'

// define associations
Location.hasMany(Storage, { foreignKey: 'locationId' })
Storage.belongsTo(Location, { foreignKey: 'locationId' })

Location.hasMany(LocationPrice, { foreignKey: 'locationId' })
LocationPrice.belongsTo(Location, { foreignKey: 'locationId' })

Location.hasMany(Order, { foreignKey: 'locationId' })
Order.belongsTo(Location, { foreignKey: 'locationId' })

User.belongsTo(UserRole, { foreignKey: 'userRoleId' })
UserRole.hasMany(User, { foreignKey: 'userRoleId' })

User.belongsTo(Location, {foreignKey: 'locationId'})
Location.hasMany(User, {foreignKey: 'locationId'})

Order.hasMany(OrderRow, { foreignKey: 'orderId' })
OrderRow.belongsTo(Order, { foreignKey: 'orderId' })

Product.hasMany(Storage, { foreignKey: 'productId' })
Storage.belongsTo(Product, { foreignKey: 'productId' })

Product.hasMany(OrderRow, { foreignKey: 'productId' })
OrderRow.belongsTo(Product, { foreignKey: 'productId' })

export { Location, LocationPrice, Order, OrderRow, Product, Storage, User, UserRole }
