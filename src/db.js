import pg from "pg";
import { config } from "./config/config.js";

// connection pool to keep the db connection alive n not create a new one for every request
const { Pool } = pg;

// console.log(config.dbUrl)

const pool = new Pool({
    connectionString: config.dbUrl,
});

export default pool;
