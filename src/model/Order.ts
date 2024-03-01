import { Model, DataTypes, BelongsToGetAssociationMixin } from 'sequelize'
import { sequelize } from '../util/db'
import { Location } from './Location'

export class Order extends Model {
    declare orderId: number
    declare locationId: number
    declare status: string
    declare createdAt: string
    declare getLocation: BelongsToGetAssociationMixin<Location>
}

Order.init({
    orderId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    locationId: {
        type: DataTypes.INTEGER,
    },
    status: {
        type: DataTypes.STRING(20)
    },
}, {
    sequelize,
    modelName: 'order',
    timestamps: true,
    updatedAt: true,
    createdAt: true
})