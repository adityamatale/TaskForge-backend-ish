import 'dotenv/config';
import express from "express";
import tasksRouter from './routes/tasks.js';


//temp
// import pool from "./db.js";

// create express app for endpoints
const app = express();

app.use(express.json());

//use router
app.use("/tasks", tasksRouter);

app.get('/', async (req, res)=>{
    // const result = await pool.query("SELECT NOW()");
    res.json(
        {
            message: 'Task manager API is running!'
            // database_time: result.rows[0].now
        }
    );
});

app.listen(process.env.PORT || 8000, ()=> {console.log("server live on http://localhost:3000")})

