import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../util/db'

export class Product extends Model {
    declare productId: number
    declare productName: string
    declare productAmount: number
}

Product.init({
    productId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    productName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    productAmount: {
        type: DataTypes.INTEGER,
    }
}, {
    sequelize,
    modelName: 'product',
    timestamps: false,
});
