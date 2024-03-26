import { Model, DataTypes } from 'sequelize'
import { sequelize} from '../util/db'

export class UserRole extends Model {
    declare userRoleId: number
    declare roleName: string
}

UserRole.init({
    userRoleId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    roleName: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    }
}, {
    sequelize,
    modelName: 'userRole',
    timestamps: false,
})