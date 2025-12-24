const sql = require('mssql');
require('dotenv').config();

const config = process.env.DB_CONNECTION_STRING 
    ? process.env.DB_CONNECTION_STRING 
    : {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        server: process.env.DB_SERVER, 
        database: process.env.DB_DATABASE,
        options: {
            encrypt: true, 
            trustServerCertificate: false 
        }
    };

// Debug logging (masking secrets)
if (typeof config === 'string') {
    console.log("Using DB_CONNECTION_STRING:", config.substring(0, 20) + "...");
} else {
    console.log("Using individual DB params. Server:", config.server);
}


async function connectToDb() {
    if (!config) {
        console.warn("Missing DB configuration (DB_CONNECTION_STRING or individual vars). Skipping database connection.");
        return null;
    }
    try {
        const pool = await sql.connect(config);
        console.log("Connected to Azure SQL Database");
        return pool;
    } catch (err) {
        console.error("Database connection failed!", err);
        return null; // Graceful failure for demo purposes
    }
}

module.exports = {
    connectToDb,
    sql
};
