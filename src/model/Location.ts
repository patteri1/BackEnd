import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../util/db'
import { Storage } from './Storage'

export class Location extends Model {
    // type definitions
    declare id: number
    declare name: string
    declare address: string
    declare postalCode: string
    declare city: string
    declare price: number
}

// map Location class to a table in the database
Location.init({
    id: {
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
    postalCode: {
        type: DataTypes.STRING(128),
    },
    city: {
        type: DataTypes.STRING(128),
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
}, {
    sequelize,
    modelName: 'location',
    timestamps: false,
})

Location.hasMany(Storage)