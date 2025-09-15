import mysql from "mysql2/promise"


const pool = mysql.createPool({
  host: "switchyard.proxy.rlwy.net",
  port:'51542',
  user: "root",
  password: "ORphpKZrOlKiHwXMOOsEWpfFymBrGBxA",
  database: "xeno"
});

export default pool;
