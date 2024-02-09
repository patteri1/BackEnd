import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../util/db'

export class PalletType extends Model {
    declare palletTypeId: number
    declare product: string
    declare amount: number
}

PalletType.init({
    palletTypeId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    product: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    amount: {
        type: DataTypes.INTEGER,
    }
}, {
    sequelize,
    modelName: 'palletType',
    timestamps: false,
});
