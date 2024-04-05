import { Model, DataTypes, BelongsToGetAssociationMixin } from 'sequelize'
import { sequelize } from '../util/db'
import { UserRole } from './UserRole'
import { Location } from './Location'

export class User extends Model {
    declare userId: number
    declare username: string
    declare passwordHash: string
    declare userRoleId: number
    declare getUserRole: BelongsToGetAssociationMixin<UserRole>
    declare locationId: number
    declare getLocation: BelongsToGetAssociationMixin<Location>
}

User.init({
    userId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    locationId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    passwordHash: {
        type: DataTypes.STRING(60),
        allowNull: false,
    },
    userRoleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'user',
    timestamps: false,
})