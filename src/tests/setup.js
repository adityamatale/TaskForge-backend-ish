import pool from "../db.js";
import { beforeAll, afterAll } from "vitest";
// import { beforeEach, afterEach } from "vitest";      // this is called before each test instead of before the entire test process

console.log("🧹 TEST SETUP LOADED");

// before all test clear the data in the tables
beforeAll(async () => {
    console.log("🧹 Cleaning test database...");

    await pool.query(
        "TRUNCATE TABLE tasks RESTART IDENTITY CASCADE"
    );
});

// close the database connection after all tests
afterAll(async () => {
    await pool.end();
});