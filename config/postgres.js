const mysql = require("mysql2/promise");

// create a connection pool for MySQL
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
});

const connectMySQL = async () => {
  try {
    const conn = await pool.getConnection();
    console.log("MySQL connected successfully");
    conn.release();
  } catch (err) {
    console.error("MySQL connection failed:", err.message);
    process.exit(1);
  }
};

// create users table if it doesn't exist
const createUsersTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await pool.query(query);
    console.log("Users table is ready");
  } catch (err) {
    console.error("Error creating users table:", err.message);
  }
};

module.exports = { pool, connectMySQL, createUsersTable };
