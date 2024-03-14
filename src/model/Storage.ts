import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../util/db'

export class Storage extends Model {
    declare storageId: number
    declare locationId: number
    declare productId: number
    declare palletAmount: number
    declare createdAt: string
}

Storage.init({
    storageId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    locationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    palletAmount: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'storage',
    timestamps: true,
    updatedAt: true,
    createdAt: true
})