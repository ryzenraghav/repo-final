import "dotenv/config";
import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function waitForDB() {
  while (true) {
    try {
      await pool.query("SELECT 1");
      console.log("DB connected successfully ✅");
      break;
    } catch (err) {
      console.log("Waiting for DB... ⏳");
      await new Promise((res) => setTimeout(res, 2000));
    }
  }
}

await waitForDB();

export default pool;
