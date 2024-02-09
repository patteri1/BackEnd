import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../util/db'
import { Storage } from './Storage'
import { OrderRow } from './OrderRow'

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

PalletType.hasMany(Storage, { foreignKey: 'palletTypeId' })
Storage.belongsTo(PalletType, { foreignKey: 'palletTypeId' })

PalletType.hasMany(OrderRow, { foreignKey: 'palletTypeId' })
OrderRow.belongsTo(PalletType, { foreignKey: 'palletTypeId' })