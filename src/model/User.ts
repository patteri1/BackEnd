import { Model, DataTypes } from 'sequelize'
import { sequelize} from '../util/db'

export class User extends Model {
    declare id: number
    declare username: string
    declare passwordHash: string
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
    modelName: 'user',
    timestamps: false,
})

export default User