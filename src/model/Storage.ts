import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../util/db'

export class Storage extends Model {
    declare locationId: number
    declare palletTypeId: number
    declare palletAmount: number
    declare createdAt: string
}

Storage.init({
    storageId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
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