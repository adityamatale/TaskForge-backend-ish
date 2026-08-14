import { ZodError } from "zod";
import logger from "../utils/logger.js";

export function errorHandler(err, req, res, next) {

    logger.error({
        error: err.message,
        stack: err.stack,
        method: req.method,
        path: req.originalUrl
    }, "Request failed");

    // Zod validation error
    if (err instanceof ZodError) {
        return res.status(400).json({
            message: "Validation failed",
            errors: err.issues
        });
    }

    // PostgreSQL unique constraint violation
    if (err.code === "23505") {
        return res.status(409).json({
            message: "Email already exists"
        });
    }

    // Unknown/unexpected error
    res.status(500).json({
        message: "Internal server error"
    });
}