import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../util/db'
import { Storage } from './Storage'

export class PalletType extends Model {
    declare locationId: number
    declare amount: number
}

PalletType.init({
    palletTypeId: {
        type: DataTypes.INTEGER,
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
Storage.belongsTo(PalletType)