import 'dotenv/config';
import pg from "pg";

// connection pool to keep the db connection alive n not create a new one for every request
const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export default pool;
