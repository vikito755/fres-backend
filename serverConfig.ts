import * as dotenv from 'dotenv';
dotenv.config()

export interface Config {
    dbHost: string,
    dbUser: string,
    dbPort: string,
    dbPassword: string,
    dbName: string,
}

const loadConfig = () => {
    if (
        !process.env.DB_HOST ||
        !process.env.DB_USER ||
        !process.env.DB_PASSWORD ||
        !process.env.DB_NAME ||
        !process.env.DB_PORT
        ) {
        throw new Error("Environment variables not found.")
    }

    const serverConfig: Config = {
        dbHost: process.env.DB_HOST,
        dbUser: process.env.DB_USER,
        dbPort: process.env.DB_PORT,
        dbPassword: process.env.DB_PASSWORD,
        dbName: process.env.DB_NAME
    }

    return serverConfig
}

const serverConfig = loadConfig()


export {
    serverConfig
}