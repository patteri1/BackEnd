import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../util/db'

export class OrderRow extends Model {
    declare orderId: number
    declare palletTypeId: number
    declare amount: number
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




