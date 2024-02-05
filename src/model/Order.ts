import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../util/db'

export class Order extends Model {
    declare orderId: number
    declare locationId: number
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
}, {
    sequelize,
    modelName: 'order',
    timestamps: false,
})




