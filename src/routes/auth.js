import express from "express";
import bcrypt from "bcrypt";
import pool from "../db.js";
import {registerSchema, loginSchema} from "../validation/userSchema.js";
import jwt from "jsonwebtoken";


const router = express.Router();


// register user
router.post('/register', async (req, res, next) => {
    try{
        const {name, email, password} = registerSchema.parse(req.body);

        //Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // register user to the db
        const result = await pool.query(
            `
            INSERT INTO users(name, email, password_hash) 
            VALUES ($1, $2, $3) 
            RETURNING id, name, email, created_at
            `,
            [name, email, passwordHash]
        );

        res.status(201).json(result.rows[0]);

    }
    catch(err){
        next(err);
    }

});


//login user
router.post("/login", async (req, res, next) => {
    try {
        const { email, password } = loginSchema.parse(req.body);

        // Find user
        const result = await pool.query(
            `
            SELECT *
            FROM users
            WHERE email = $1
            `,
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const user = result.rows[0];

        // Compare password with stored hash
        const passwordMatch = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Create JWT
        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        // Login successful
        res.json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch (err) {
        next(err);
    }
});


export default router;