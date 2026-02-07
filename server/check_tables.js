import dotenv from "dotenv";
dotenv.config();
import db from "./utils/db.js";

async function checkTables() {
    try {
        const res = await db.query(
            "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
        );
        console.log("Tables:", res.rows);
    } catch (err) {
        console.error("Error checking tables:", err);
    }
    process.exit();
}

checkTables();
