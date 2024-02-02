import { Sequelize } from "sequelize";
import { UserRole } from "../model";

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

export { connectToDatabase, initializeRoles, sequelize }