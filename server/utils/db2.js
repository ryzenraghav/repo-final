import pg from "pg";

const { Pool } = pg;

const pool2 = new Pool({
    user: "user123",
    host: "localhost",
    database: "tutorial_db",
    password: "password123",
    port: 5433,
});

pool2.on("error", (err) => {
    console.error("Unexpected error on idle client (db2)", err);
});

// Test connection on startup
pool2
    .query("SELECT 1")
    .then(() => console.log("DB2 (tutorial_db) connected successfully ✅"))
    .catch((err) => console.error("DB2 connection failed ❌", err.message));

export default pool2;
