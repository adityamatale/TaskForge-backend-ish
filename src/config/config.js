import dotenv from "dotenv";

dotenv.config({
    path: process.env.NODE_ENV === "test"
        ? ".env.test"
        : ".env"
});

export const config = {
    port: process.env.PORT || 3000,
    dbUrl: process.env.DATABASE_URL,
};