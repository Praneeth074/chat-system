const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
});

pool.connect((err, connection, release) => {
  if (err) {
    console.error("Error connecting to PostgreSQL:", err.stack);
    return;
  }

  console.log("PostgreSQL connected successfully");
  release();
});

module.exports = pool;
