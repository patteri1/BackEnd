import bcrypt from 'bcrypt'
import { Sequelize } from "sequelize";
import { User, UserRole } from "../model";
import 'dotenv/config'

const database = process.env.DB_NAME!
const username = process.env.DB_USERNAME!
const password = process.env.DB_PASSWORD!
const port = 5432
const sequelize = new Sequelize(database, username, password, {
    host: process.env.DB_HOST,
    port: port,
    dialect: 'postgres',
    define: {
        freezeTableName: true
    }
})

const connectToDatabase = async () => {
    try {
        await sequelize.authenticate()
        console.log("Database connection OK")
    } catch (error) {
        console.log("Database connection failed", error)
        return process.exit(1)
    }

    return null
}

const initializeRoles = async () => {
    const roles: string[] = ['admin', 'transport', 'processing']

    try {
        for (const roleName of roles) {
            await UserRole.findOrCreate({
                where: { roleName: roleName },
                defaults: { roleName: roleName },
            })
        }

    } catch (error) {
        console.error('Error initializing roles:', error);
    }
}

const initializeAdminUser = async () => {
    const adminUsername: string = process.env.ADMIN_USERNAME!
    const adminPassword: string = process.env.ADMIN_PASSWORD!

    // Hash the password
	const saltRounds: number = 10
	const adminPasswordHash: string = await bcrypt.hash(adminPassword, saltRounds)

    const userUsername: string = process.env.USER_USERNAME!
    const userPassword: string = process.env.USER_PASSWORD!

    // Hash the password

	const userPasswordHash: string = await bcrypt.hash(userPassword, saltRounds)


    try {
        await User.findOrCreate({
            where: { username: adminUsername },
            defaults: { username: adminUsername, passwordHash: adminPasswordHash, userRoleId: 1, locationId: 4 },
        })
        await User.findOrCreate({
            where: { username: userUsername },
            defaults: { username: userUsername, passwordHash: userPasswordHash, userRoleId: 2, locationId: 1 },
        })

    } catch (error) {
        console.error('Error initialising the admin user:', error);
    }
}

export { connectToDatabase, initializeRoles,initializeAdminUser, sequelize }