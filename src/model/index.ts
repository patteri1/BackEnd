import User from "./User"
import UserRole from "./UserRole"
import Location from "./Location"

// define associations
User.belongsTo(UserRole)
UserRole.hasMany(User)

export { User, UserRole, Location}