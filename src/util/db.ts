import { Sequelize } from "sequelize";

const sequelize = new Sequelize("postgres://postgres@localhost:5432/postgres", {
    define: {
        freezeTableName: true
    }
})

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

export { connectToDatabase, sequelize }