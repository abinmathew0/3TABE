require('dotenv').config();
const { connectToDb, sql } = require('./db');

async function testConnection() {
    console.log("Testing database connection...");
    try {
        const pool = await connectToDb();
        if (pool) {
            console.log("Successfully connected to the database!");
            const result = await pool.request().query('SELECT 1 as number');
            console.log("Test query result:", result.recordset);
            await pool.close();
        } else {
            console.log("Failed to connect: connectToDb returned null.");
        }
    } catch (error) {
        console.error("Error during connection test:", error);
    }
}

testConnection();
