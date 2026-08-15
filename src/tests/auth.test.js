import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js";


describe("POST /auth/register", () => {

    it("should register a new user", async () => {
        const response = await request(app)
            .post("/auth/register")
            .send({
                name: "Test User",
                email: "test-auth@example.com",
                password: "password123"
            });

        expect(response.status).toBe(201);

        expect(response.body).toHaveProperty("id");
        expect(response.body.name).toBe("Test User");
        expect(response.body.email).toBe("test-auth@example.com");

        // Password should NEVER be returned
        expect(response.body).not.toHaveProperty("password");
        expect(response.body).not.toHaveProperty("password_hash");
    });


    it("should reject duplicate email", async () => {

        // Register first user
        await request(app)
            .post("/auth/register")
            .send({
                name: "Test User",
                email: "duplicate@example.com",
                password: "password123"
            });

        // Try registering same email again
        const response = await request(app)
            .post("/auth/register")
            .send({
                name: "Another User",
                email: "duplicate@example.com",
                password: "password123"
            });

        expect(response.status).toBe(409);
    });


    it("should reject invalid email", async () => {
        const response = await request(app)
            .post("/auth/register")
            .send({
                name: "Test User",
                email: "not-an-email",
                password: "password123"
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("errors");
    });


    it("should reject empty name", async () => {
        const response = await request(app)
            .post("/auth/register")
            .send({
                name: "",
                email: "empty-name@example.com",
                password: "password123"
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("errors");
    });


    it("should reject invalid password", async () => {
        const response = await request(app)
            .post("/auth/register")
            .send({
                name: "Test User",
                email: "short-password@example.com",
                password: "123"
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("errors");
    });

});


describe("POST /auth/login", () => {

    it("should login with valid credentials", async () => {

        // Create user first
        await request(app)
            .post("/auth/register")
            .send({
                name: "Login User",
                email: "login-test@example.com",
                password: "password123"
            });

        const response = await request(app)
            .post("/auth/login")
            .send({
                email: "login-test@example.com",
                password: "password123"
            });

        expect(response.status).toBe(200);

        // JWT should be returned
        expect(response.body).toHaveProperty("token");
        expect(typeof response.body.token).toBe("string");

        // Password should NEVER be returned
        expect(response.body).not.toHaveProperty("password");
        expect(response.body).not.toHaveProperty("password_hash");
    });


    it("should reject incorrect password", async () => {

        await request(app)
            .post("/auth/register")
            .send({
                name: "Wrong Password User",
                email: "wrong-password@example.com",
                password: "password123"
            });

        const response = await request(app)
            .post("/auth/login")
            .send({
                email: "wrong-password@example.com",
                password: "wrongpassword"
            });

        expect(response.status).toBe(401);
    });


    it("should reject non-existent user", async () => {

        const response = await request(app)
            .post("/auth/login")
            .send({
                email: "does-not-exist@example.com",
                password: "password123"
            });

        expect(response.status).toBe(401);
    });


    it("should reject invalid login email", async () => {

        const response = await request(app)
            .post("/auth/login")
            .send({
                email: "not-an-email",
                password: "password123"
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("errors");
    });


    it("should reject missing login password", async () => {

        const response = await request(app)
            .post("/auth/login")
            .send({
                email: "login-test@example.com"
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("errors");
    });

});