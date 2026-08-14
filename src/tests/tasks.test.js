import { describe, it, expect } from "vitest";  // to check the frame work
import request from "supertest";    //for fake api reqests
import app from "../app.js";


// test cases
describe("Tasks API", () => {

    // GET /tasks
    it("should return all tasks", async () => {
        const response = await request(app)
            .get("/tasks");

        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });


    // POST /tasks
    it("should create a new task", async () => {
        const response = await request(app)
            .post("/tasks")
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
            .send({
                title: "Task for GET test"
            });

        const id = created.body.id;

        const response = await request(app)
            .get(`/tasks/${id}`);

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(id);
    });


    // GET /tasks/:id - not found
    it("should return 404 when task does not exist", async () => {
        const response = await request(app)
            .get("/tasks/999999");

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("task not found");
    });


    // PATCH /tasks/:id
    it("should update a task", async () => {

        const created = await request(app)
            .post("/tasks")
            .send({
                title: "Original task"
            });

        const id = created.body.id;

        const response = await request(app)
            .patch(`/tasks/${id}`)
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
            .send({
                title: "Task"
            });

        const id = created.body.id;

        const response = await request(app)
            .patch(`/tasks/${id}`)
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
            .send({
                title: "Task to delete"
            });

        const id = created.body.id;

        const response = await request(app)
            .delete(`/tasks/${id}`);

        expect(response.status).toBe(200);
        expect(response.body.message)
            .toBe("task deleted successfully");
    });


    // DELETE /tasks/:id - not found
    it("should return 404 when deleting a non-existent task", async () => {

        const response = await request(app)
            .delete("/tasks/999999");

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("task not found");
    });

});