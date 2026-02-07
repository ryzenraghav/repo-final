import "dotenv/config";
import db from "./utils/db.js";
import fs from "fs";

async function dumpSchema() {
    try {
        const usersRes = await db.query(
            "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'users'"
        );
        const resultsRes = await db.query(
            "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'results'"
        );

        const output = {
            users: usersRes.rows,
            results: resultsRes.rows
        };

        fs.writeFileSync("schema_dump.json", JSON.stringify(output, null, 2));
        console.log("Schema dumped to schema_dump.json");
    } catch (err) {
        console.error("Error checking schema:", err);
    }
    process.exit();
}

dumpSchema();
