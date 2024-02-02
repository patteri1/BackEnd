import bcrypt from 'bcrypt'
import { Sequelize } from "sequelize";
import { User, UserRole } from "../model";

const sequelize = new Sequelize("postgres://postgres@localhost:5432/postgres")

const connectToDatabase = async () => {
    try {
        await sequelize.authenticate()
        console.log("Database connection OK")
    } catch (error) {
        console.log("Database connection failed")
        return process.exit(1)
    }

    return null
}

const initializeRoles = async () => {
    const roles: string[] = ['admin', 'transport', 'processing']

    try {
        for (const roleName of roles) {
            await UserRole.findOrCreate({
                where: { name: roleName },
                defaults: { name: roleName },
            })
        }

    } catch (error) {
        console.error('Error initializing roles:', error);
    }
}

const initializeAdminUser = async () => {
    const username: string = process.env.ADMIN_USERNAME!
    const password: string = process.env.ADMIN_PASSWORD!

    // Hash the password
	const saltRounds: number = 10
	const passwordHash: string = await bcrypt.hash(password, saltRounds)


    try {
        await User.findOrCreate({
            where: { username },
            defaults: { username, passwordHash, UserRoleId: 1 },
        })

    } catch (error) {
        console.error('Error initialising the admin user:', error);
    }
}

export { connectToDatabase, initializeRoles,initializeAdminUser, sequelize }