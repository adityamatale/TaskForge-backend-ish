import pool from "../db.js";

async function migrate() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS migrations (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) UNIQUE NOT NULL,
                run_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log("Migration tracking table ready");

        const migrationName = "001_create_tasks";

        const result = await pool.query(
            "SELECT * FROM migrations WHERE name = $1",
            [migrationName]
        );

        if (result.rows.length > 0) {
            console.log(`⏭️  ${migrationName} already applied`);
            return;
        }

        await pool.query(`
            CREATE TABLE IF NOT EXISTS tasks (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                completed BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await pool.query(
            "INSERT INTO migrations (name) VALUES ($1)",
            [migrationName]
        );

        console.log(`✅ ${migrationName} applied`);

    } catch (error) {
        console.error("❌ Migration failed:", error);
    } finally {
        await pool.end();
    }
}

migrate();