import { Model, DataTypes } from 'sequelize'
import { sequelize} from '../util/db'

export class UserRole extends Model {
    declare id: number
    declare name: string
}

UserRole.init({
    id: {
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
    timestamps: false,
})

export default UserRole