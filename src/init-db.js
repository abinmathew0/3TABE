require('dotenv').config(); 
const fs = require('fs');
const path = require('path');
const { connectToDb } = require('./db');

async function initDb() {
    console.log("Initializing database...");
    const pool = await connectToDb();
    
    if (!pool) {
        console.error("Failed to connect to DB. Check .env and firewall rules.");
        return;
    }

    try {
        const schemaPath = path.join(__dirname, '../schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        console.log(`Reading schema from ${schemaPath}...`);
        console.log("Executing schema...");
        
        // Split by simple go/semicolon if needed, but often mssql can handle the batch if simple.
        // For safety, let's run it as a single request if it's just CREATE/INSERT.
        
        await pool.request().query(schemaSql);
        
        console.log("Database initialized successfully! Table 'ToDos' created.");
    } catch (err) {
        console.error("Error initializing database:", err);
    } finally {
        pool.close();
    }
}

// Adjust dotenv path for the script location
// Assuming we run this from 'backend' root folder: node scripts/init-db.js 
// user is in backend root.
// let's put this script in backend/src/init-db.js to align with db.js being in src

initDb();
