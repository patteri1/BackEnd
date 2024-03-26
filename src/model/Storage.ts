import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../util/db'
import { formatDateTime } from '../util/datetimeUtils'

export class Storage extends Model {
    declare storageId: number
    declare locationId: number
    declare productId: number
    declare palletAmount: number
    declare createdAt: Date
    declare updatedAt: Date
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
    createdAt: {
        type: DataTypes.DATE,
        get() {
            return formatDateTime(this.dataValues.createdAt)
        }
    },
    updatedAt: {
        type: DataTypes.DATE,
        get() {
            return formatDateTime(this.dataValues.updatedAt)
        }
    }
}, {
    sequelize,
    modelName: 'storage',
    timestamps: true,
    updatedAt: true,
    createdAt: true
})