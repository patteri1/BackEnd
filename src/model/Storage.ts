import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../util/db'

export class Storage extends Model {
    declare locationId: number
    declare palletTypeId: number
    declare amount: number
    declare createdAt: Date
}

Storage.init({
    storageId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'storage',
    timestamps: true,
})