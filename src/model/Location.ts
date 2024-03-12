import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../util/db'
import { LocationPrice } from './LocationPrice'
import { Storage } from './Storage'

export class Location extends Model {
    // type definitions
    declare locationId: number
    declare name: string
    declare address: string
    declare postCode: string
    declare city: string
    declare locationType: string
    declare locationPrices: LocationPrice[]
    declare storages: Storage[]
}

// map Location class to a table in the database
Location.init({
    locationId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(128),
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING(128),
    },
    postCode: {
        type: DataTypes.STRING(128),
    },
    city: {
        type: DataTypes.STRING(128),
    },
    locationType: {
        type: DataTypes.STRING(128),
    },
}, {
    sequelize,
    modelName: 'location',
    timestamps: false,
})
