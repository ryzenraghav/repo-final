import "dotenv/config";
import db from "./utils/db.js";

async function checkSchema() {
    try {
        console.log("--- USERS TABLE ---");
        const usersRes = await db.query(
            "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'users'"
        );
        console.log(usersRes.rows);

        console.log("\n--- RESULTS TABLE ---");
        const resultsRes = await db.query(
            "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'results'"
        );
        console.log(resultsRes.rows);
    } catch (err) {
        console.error("Error checking schema:", err);
    }
    process.exit();
}

checkSchema();
