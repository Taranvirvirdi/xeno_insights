import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

async function testConnection() {
  try {
    const conn = await mysql.createConnection({
      host: `switchyard.proxy.rlwy.net`, 
      port: '51542',// or remote IP
      user: `root`,
      password: `ORphpKZrOlKiHwXMOOsEWpfFymBrGBxA`,
      database: "railway"
    });
    console.log("✅ Connected to MySQL!");
    await conn.end();
  } catch (err) {
    console.error("❌ Connection failed:", err);
  }
}

testConnection();
