import pool from "../db.js";
import logger from "../utils/logger.js";

import { up as createTasks } from "./001_create_tasks.js";
import { up as createUsers } from "./002_create_users.js";
import { up as addUserToTasks } from "./003_add_user_to_tasks.js";

const migrations = [
    {
        name: "001_create_tasks",
        up: createTasks
    },
    {
        name: "002_create_users",
        up: createUsers
    },
    {
        name: "003_add_user_to_tasks",
        up: addUserToTasks
    }
];

async function runMigrations() {
    try {
        // Create migration tracking table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS migrations (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) UNIQUE NOT NULL,
                run_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        logger.info("Migration tracking table ready");

        // Check and run each migration
        for (const migration of migrations) {

            const result = await pool.query(
                "SELECT * FROM migrations WHERE name = $1",
                [migration.name]
            );

            // Already applied
            if (result.rows.length > 0) {
                logger.info(
                    `Skipping ${migration.name} - already applied`
                );
                continue;
            }

            // Run migration
            await migration.up(pool);

            // Record migration
            await pool.query(
                "INSERT INTO migrations (name) VALUES ($1)",
                [migration.name]
            );

            logger.info(`${migration.name} applied successfully`);
        }

        logger.info("All migrations completed");

    } catch (error) {
        logger.error(error, "Migration failed");
        process.exitCode = 1;
    } finally {
        await pool.end();
    }
}

runMigrations();