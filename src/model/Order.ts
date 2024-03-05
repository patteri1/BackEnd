import { Model, DataTypes, BelongsToGetAssociationMixin } from 'sequelize'
import { sequelize } from '../util/db'
import { Location } from './Location'

export class Order extends Model {
    declare orderId: number
    declare locationId: number
    declare status: string
    declare createdAt: string
    declare getLocation: BelongsToGetAssociationMixin<Location>
}

Order.init({
    orderId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    locationId: {
        type: DataTypes.INTEGER,
    },
    status: {
        type: DataTypes.STRING(20)
    },
    createdAt: {
        type: DataTypes.DATE,
        get() {
            const dateTime = new Date(`${this.dataValues.createdAt}`)
            // todo: check if handles dst correctly
            // also move this to utils
            const date = dateTime.toLocaleDateString('fi-FI', {timeZone: 'Europe/Helsinki'}) // dd.mm.yyyy
            const time = dateTime.toLocaleTimeString('en-GB', {timeZone: 'Europe/Helsinki'}) // hh:mm:ss
            return `${date} ${time}`
        }
    }
}, {
    sequelize,
    modelName: 'order',
    timestamps: true,
    updatedAt: true,
    createdAt: true
})