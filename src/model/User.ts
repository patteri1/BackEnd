import { Model, DataTypes, BelongsToGetAssociationMixin } from 'sequelize'
import { sequelize } from '../util/db'
import UserRole from './UserRole'

export class User extends Model {
    declare id: number
    declare username: string
    declare passwordHash: string
    declare getUserRole: BelongsToGetAssociationMixin<UserRole>
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    passwordHash: {
        type: DataTypes.STRING(60),
        allowNull: false,
    }
}, {
    sequelize,
    timestamps: false,
})

export default User