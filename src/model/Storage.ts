import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../util/db'
import { Location } from './Location'

export class Storage extends Model {
    declare locationId: number
    declare amount: number
}

Storage.init({
    locationId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: Location,
            key: 'id'
        }
    },
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'storage',
    timestamps: false,
});