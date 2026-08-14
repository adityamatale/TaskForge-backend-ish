// Responsible for creating/configuring Express.

import express from "express";
import cors from "cors";

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

// // for prod allow a specific url to make request to express endpoints
// app.use(cors({
//     origin: "https://your-frontend.com"
// }));

app.use(cors());    // allow browser to make requests to the endpoints (for dev allow all origins)
app.use(express.json());

//use router
app.use("/tasks", authenticate, tasksRouter);
app.use("/auth", authRouter);

// use centraliezed error handling | must be after routes
app.use(errorHandler);


export default app;