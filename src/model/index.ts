import { Location } from './Location'
import { PostalCode } from './PostalCode'
import { Order } from './Order'
import { OrderRow } from './OrderRow'
import { PalletType } from './PalletType'
import { Storage } from './Storage'
import { UserRole } from "./UserRole"
import { User } from "./User"

// define associations
Location.hasMany(Storage, { foreignKey: 'locationId' })
Storage.belongsTo(Location, { foreignKey: 'locationId' })

User.belongsTo(UserRole)
UserRole.hasMany(User)

Location.hasMany(Order, { foreignKey: 'locationId' })
Order.belongsTo(Location, { foreignKey: 'locationId' })

Order.hasMany(OrderRow, { foreignKey: 'orderId' })
OrderRow.belongsTo(Order, { foreignKey: 'orderId' })

PalletType.hasMany(Storage, { foreignKey: 'palletTypeId' })
Storage.belongsTo(PalletType, { foreignKey: 'palletTypeId' })

PalletType.hasMany(OrderRow, { foreignKey: 'palletTypeId' })
OrderRow.belongsTo(PalletType, { foreignKey: 'palletTypeId' })

PostalCode.hasMany(Location, { foreignKey: 'postCode' })
Location.belongsTo(PostalCode, { foreignKey: 'postCode' })

export { Location, Order, OrderRow, PalletType, Storage, PostalCode, User, UserRole }
