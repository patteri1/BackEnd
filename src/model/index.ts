import { Location } from './Location'
import { PostalCode } from './PostalCode'
import { UserRole } from "./UserRole"
import { User } from "./User"

// define associations
PostalCode.hasMany(Location, { foreignKey: 'postCode' })
Location.belongsTo(PostalCode, { foreignKey: 'postCode' })

User.belongsTo(UserRole)
UserRole.hasMany(User)

export { Location, PostalCode, User, UserRole }