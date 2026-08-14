export async function up(client) {
    await client.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);
}

// user schema

// id            → unique user ID
// name          → user's name
// email         → login identifier
// password_hash → encrypted/hashed password
// created_at    → when account was created