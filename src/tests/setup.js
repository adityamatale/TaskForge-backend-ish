import pool from "../db.js";
import { beforeAll, afterAll } from "vitest";
// import { beforeEach, afterEach } from "vitest";      // this is called before each test instead of before the entire test process
import logger from "../utils/logger.js";

// console.log("🧹 TEST SETUP LOADED");
logger.info("🧹 TEST SETUP LOADED");

// before all test clear the data in the tables
beforeAll(async () => {
    // console.log("🧹 Cleaning test database...");
    logger.info("🧹 Cleaning test database...");

    await pool.query(
        "TRUNCATE TABLE tasks, users RESTART IDENTITY CASCADE"
    );
});

// close the database connection after all tests
afterAll(async () => {
    await pool.end();
});