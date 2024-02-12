import { Model, DataTypes, BelongsToGetAssociationMixin } from 'sequelize'
import { sequelize } from '../util/db'
import { Order } from './Order'

export class OrderRow extends Model {
    declare orderId: number
    declare palletTypeId: number
    declare amount: number
    declare getOrder: BelongsToGetAssociationMixin<Order>
}

OrderRow.init({
    orderId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    palletTypeId: {
        type: DataTypes.INTEGER,
        primaryKey: true,

    },
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'orderRow',
    timestamps: false,
})




