const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  password: "forese",
  host: "localhost",
  port: 5432,
  database: "report",
});


module.exports = pool;
