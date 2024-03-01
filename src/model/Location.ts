import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../util/db'

export class Location extends Model {
    // type definitions
    declare id: number
    declare name: string
    declare address: string
    declare postCode: string
    declare city: string
    declare locationType: string
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
