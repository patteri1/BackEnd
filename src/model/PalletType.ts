import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../util/db'

export class PalletType extends Model {
    declare palletTypeId: number
    declare productName: string
    declare productAmount: number
}

PalletType.init({
    palletTypeId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    productName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    productAmount: {
        type: DataTypes.INTEGER,
    }
}, {
    sequelize,
    modelName: 'palletType',
    timestamps: false,
});
