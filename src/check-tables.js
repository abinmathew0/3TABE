require('dotenv').config();
const { connectToDb } = require('./db');

async function listTables() {
    console.log("Connecting to DB to list tables...");
    const pool = await connectToDb();
    if (!pool) return;

    try {
        const result = await pool.request().query(`
            SELECT * FROM information_schema.tables 
            WHERE table_type = 'BASE TABLE'
        `);
        console.table(result.recordset);
        
        // Also check specifically for ToDos
        const todoCheck = await pool.request().query(`
            SELECT * FROM information_schema.tables 
            WHERE table_name = 'ToDos'
        `);
        if (todoCheck.recordset.length > 0) {
            console.log("✅ Table 'ToDos' FOUND!");
            console.log("Schema:", todoCheck.recordset[0].TABLE_SCHEMA);
        } else {
            console.log("❌ Table 'ToDos' NOT FOUND.");
        }

    } catch (err) {
        console.error("Error querying tables:", err);
    } finally {
        pool.close();
    }
}

listTables();
