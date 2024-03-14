import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../util/db'

export class LocationPrice extends Model {
    declare locationPriceId: number
    declare locationId: number
    declare price: number
    declare validFrom: string
}

LocationPrice.init({
    locationPriceId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    validFrom: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
}, {
    sequelize,
    modelName: 'locationPrice',
    timestamps: false,
})