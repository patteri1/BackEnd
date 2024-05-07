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

// todo: rename
const initializeAdminUser = async () => {
    const adminUsername: string = process.env.ADMIN_USERNAME!
    const adminPassword: string = process.env.ADMIN_PASSWORD!

    // Hash the password
	const saltRounds: number = 10
	const adminPasswordHash: string = await bcrypt.hash(adminPassword, saltRounds)

    // other test users:

    const userUsername: string = process.env.USER_USERNAME!
    const userPassword: string = process.env.USER_PASSWORD!
    const userPasswordHash: string = await bcrypt.hash(userPassword, saltRounds)

    const userTransport1: string = process.env.TRANSPORT1_USERNAME!
    const pwTransport1: string = process.env.TRANSPORT1_PASSWORD!
    const pwTransport1Hash: string = await bcrypt.hash(pwTransport1, saltRounds)

    const userTransport2: string = process.env.TRANSPORT2_USERNAME!
    const pwTransport2: string = process.env.TRANSPORT2_PASSWORD!
    const pwTransport2Hash: string = await bcrypt.hash(pwTransport2, saltRounds)

    const userProcessing: string = process.env.PROCESSING_USERNAME!
    const pwProcessing: string = process.env.PROCESSING_PASSWORD!
    const pwProcessingHash: string = await bcrypt.hash(pwProcessing, saltRounds)

    try {
        await User.findOrCreate({
            where: { username: adminUsername },
            defaults: { username: adminUsername, passwordHash: adminPasswordHash, userRoleId: 1, locationId: 4 },
        })
        await User.findOrCreate({
            where: { username: userUsername },
            defaults: { username: userUsername, passwordHash: userPasswordHash, userRoleId: 2, locationId: 1 },
        })
        await User.findOrCreate({
            where: { username: userTransport1 },
            defaults: { username: userTransport1, passwordHash: pwTransport1Hash, userRoleId: 2, locationId: 1 },
        })
        await User.findOrCreate({
            where: { username: userTransport2 },
            defaults: { username: userTransport2, passwordHash: pwTransport2Hash, userRoleId: 2, locationId: 2 },
        })
        await User.findOrCreate({
            where: { username: userProcessing },
            defaults: { username: userProcessing, passwordHash: pwProcessingHash, userRoleId: 3, locationId: 3 },
        })

    } catch (error) {
        console.error('Error initialising the admin user:', error);
    }
}

export { connectToDatabase, initializeRoles,initializeAdminUser, sequelize }