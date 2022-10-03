import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

async function connection() {
    const { Pool } = pg;

    const database = new Pool({
        connectionString: process.env.DATABASE_URL,
    });

    await database.connect()

    return database
}

export default connection;