import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../util/db'
import { Location } from './Location'

export class PostalCode extends Model {
    declare postalCode: number
    declare city: number
}

PostalCode.init({
    postalCode: {
        type: DataTypes.STRING,
        primaryKey: true,

    },
    city: {
        type: DataTypes.STRING,
    },
}, {
    sequelize,
    modelName: 'postalCode',
    timestamps: false,
})
