import { Location } from './Location'
import { Order } from './Order'
import { OrderRow } from './OrderRow'
import { PalletType } from './PalletType'
import { Storage } from './Storage'
import { UserRole } from "./UserRole"
import { User } from "./User"
import { LocationPrice } from './LocationPrice'

// define associations
Location.hasMany(Storage, { foreignKey: 'locationId' })
Storage.belongsTo(Location, { foreignKey: 'locationId' })

Location.hasMany(LocationPrice, { 
    foreignKey: {
        name: 'locationId',
        allowNull: false
    }
})

LocationPrice.belongsTo(Location, { 
    foreignKey: {
        name: 'locationId',
        allowNull: false
    }
})

Location.hasMany(Storage, { foreignKey: 'locationId'})
Storage.belongsTo(Location, { foreignKey: 'locationId'})

Location.hasMany(Order, { foreignKey: 'locationId' })
Order.belongsTo(Location, { foreignKey: 'locationId' })

User.belongsTo(UserRole)
UserRole.hasMany(User)

Order.hasMany(OrderRow, { foreignKey: 'orderId' })
OrderRow.belongsTo(Order, { foreignKey: 'orderId' })

PalletType.hasMany(Storage, { foreignKey: 'palletTypeId' })
Storage.belongsTo(PalletType, { foreignKey: 'palletTypeId' })

PalletType.hasMany(OrderRow, { foreignKey: 'palletTypeId' })
OrderRow.belongsTo(PalletType, { foreignKey: 'palletTypeId' })

export { Location, LocationPrice, Order, OrderRow, PalletType, Storage, User, UserRole }
