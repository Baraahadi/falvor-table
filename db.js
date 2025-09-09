const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",        // your postgres username
  host: "localhost",       // database server
  database: "flavor_table",        // your database name
  password: "0000",// the password you set during installation
  port: 5432,              // default PostgreSQL port
});

module.exports = pool;