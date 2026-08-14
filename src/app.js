// Responsible for creating/configuring Express.

import express from "express";

import tasksRouter from './routes/tasks.js';
import authRouter from "./routes/auth.js";

import { errorHandler } from './middleware/errorHandler.js';
import { authenticate } from "./middleware/authMiddleware.js";

import logger from "./utils/logger.js";
import pinoHttp from "pino-http";

//temp
// import pool from "./db.js";

// create express app for endpoints
const app = express();

// http logger - request/access logging - middleware
app.use(pinoHttp({
    logger
}));

app.use(express.json());

//use router
app.use("/tasks", authenticate, tasksRouter);
app.use("/auth", authRouter);

// use centraliezed error handling | must be after routes
app.use(errorHandler);


export default app;