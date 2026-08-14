import pino from "pino";

const logger = pino({
    level: "info",
    transport: {
        target: "pino-pretty"
    }
});

export default logger;


// levels for logging

// logger.debug() → detailed debugging
// logger.info()  → normal events
// logger.warn()  → something unusual
// logger.error() → something failed