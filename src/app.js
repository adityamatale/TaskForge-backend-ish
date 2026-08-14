// Responsible for creating/configuring Express.

import express from "express";
import tasksRouter from './routes/tasks.js';
import { errorHandler } from './middleware/errorHandler.js';

//temp
// import pool from "./db.js";

// create express app for endpoints
const app = express();

app.use(express.json());

//use router
app.use("/tasks", tasksRouter);

// use centraliezed error handling | must be after routes
app.use(errorHandler);


export default app;