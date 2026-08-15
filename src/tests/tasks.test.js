import { describe, it, expect, beforeAll } from "vitest";  // to check the frame work
import request from "supertest";    //for fake api reqests
import app from "../app.js";


// test cases
describe("Tasks API", () => {
    
    let token;

    // make a test user (register n login) to get the JWT token for authentication on every request
    beforeAll(async () => {
        await request(app)
            .post("/auth/register")
            .send({
                name: "Test User",
                email: "tasks-test@example.com",
                password: "password123"
            });
    
        const response = await request(app)
            .post("/auth/login")
            .send({
                email: "tasks-test@example.com",
                password: "password123"
            });
    
        token = response.body.token;
    });

    // GET /tasks
    it("should return all tasks", async () => {
        const response = await request(app)
            .get("/tasks")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });


    // POST /tasks
    it("should create a new task", async () => {
        const response = await request(app)
            .post("/tasks")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Test task",
                description: "Created during testing"
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body.title).toBe("Test task");
        expect(response.body.completed).toBe(false);
    });


    // POST /tasks - validation
    it("should reject an invalid task", async () => {
        const response = await request(app)
            .post("/tasks")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: ""
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message");
        expect(response.body).toHaveProperty("errors");
    });


    // GET /tasks/:id
    it("should return a single task", async () => {

        // Create one first
        const created = await request(app)
            .post("/tasks")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Task for GET test"
            });

        const id = created.body.id;

        const response = await request(app)
            .get(`/tasks/${id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(id);
    });


    // GET /tasks/:id - not found
    it("should return 404 when task does not exist", async () => {
        const response = await request(app)
            .get("/tasks/999999")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("task not found");
    });


    // PATCH /tasks/:id
    it("should update a task", async () => {

        const created = await request(app)
            .post("/tasks")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Original task"
            });

        const id = created.body.id;

        const response = await request(app)
            .patch(`/tasks/${id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Updated task",
                completed: true
            });

        expect(response.status).toBe(200);
        expect(response.body.title).toBe("Updated task");
        expect(response.body.completed).toBe(true);
    });


    // PATCH /tasks/:id - validation
    it("should reject invalid task updates", async () => {

        const created = await request(app)
            .post("/tasks")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Task"
            });

        const id = created.body.id;

        const response = await request(app)
            .patch(`/tasks/${id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                completed: "yes"
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("errors");
    });


    // DELETE /tasks/:id
    it("should delete a task", async () => {

        const created = await request(app)
            .post("/tasks")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Task to delete"
            });

        const id = created.body.id;

        const response = await request(app)
            .delete(`/tasks/${id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("task deleted successfully");
    });


    // DELETE /tasks/:id - not found
    it("should return 404 when deleting a non-existent task", async () => {

        const response = await request(app)
            .delete("/tasks/999999")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("task not found");
    });

});