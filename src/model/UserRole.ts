import { Model, DataTypes } from 'sequelize'
import { sequelize} from '../util/db'

export class UserRole extends Model {
    declare userRoleId: number
    declare name: string
}

UserRole.init({
    userRoleId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    }
}, {
    sequelize,
    modelName: 'userRole',
    timestamps: false,
})