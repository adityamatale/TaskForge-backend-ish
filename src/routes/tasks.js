import express from "express";
import pool from "../db.js";
import {createTaskSchema, updateTaskSchema, taskIdSchema} from "../validation/taskSchema.js";
import logger from "../utils/logger.js";


const router = express.Router();


// get all tasks
router.get('/', async (req, res, next) => {
    try{
        // const result = await pool.query("select * from tasks");
        const result = await pool.query(
            `
            SELECT * FROM tasks
            WHERE user_id = $1
            ORDER BY id ASC
            `,
            [req.user.userId]
        );

        res.json(result.rows);
    }
    catch(err){
        next(err);
    }
});


//create a task
router.post('/', async (req, res, next) => {
    try{
        // const {title, description} = req.body;
        const data = createTaskSchema.parse(req.body);
        const result = await pool.query(
            `
            INSERT INTO tasks(title, description, user_id)
            VALUES ($1, $2, $3)
            RETURNING *
            `,
            [data.title, data.description, req.user.userId]
        );

        logger.info(
            { taskId: result.rows[0].id },
            "Task created"
        );
        
        res.status(201).json(result.rows[0]);
    }
    catch(err){
        next(err);
    }
});


// get a single task
router.get('/:id', async (req, res, next) => {
    try{
        // const {id} = req.params; // these are parameter variables
        const {id} = taskIdSchema.parse(req.params);    // the {} around id means deconstructing object - getting a attribute of that returned obj.
        const result = await pool.query(
            `
            SELECT * FROM tasks
            WHERE id = $1 AND user_id = $2
            `,
            [id, req.user.userId]
        );

        if(!result.rows.length) {
            return res.status(404).json({message: "task not found"});
        }

        res.json(result.rows[0]);
    }
    catch(err){
        next(err);
    }
});


//patch a single task
router.patch('/:id', async (req, res, next)=>{
    try{
        // const {id} = req.params;
        const {id} = taskIdSchema.parse(req.params);
        // const {title, description, completed} = req.body;
        const {title, description, completed} = updateTaskSchema.parse(req.body);
        const result = await pool.query(
            `
            UPDATE tasks
            SET title = COALESCE($1, title),
                description = COALESCE($2, description),
                completed = COALESCE($3, completed)
            WHERE id = $4 AND user_id = $5
            RETURNING *
            `,
            [title, description, completed, id, req.user.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({message: "task not found"});
        }

        res.json(result.rows[0]);
    }
    catch(err){
        next(err);
    }
});


// delete task
router.delete('/:id', async (req, res, next) =>{
    try{
        // const {id} = req.params;
        const {id} = taskIdSchema.parse(req.params);
        const result = await pool.query(
            `
            DELETE FROM tasks
            WHERE id = $1 AND user_id = $2
            RETURNING *
            `,
            [id, req.user.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({message: "task not found"});
        }

        logger.info(
            { taskId: id },
            "Task deleted"
        );

        res.json({message: "task deleted successfully"});
    }
    catch(err){
        next(err);
    }
});


export default router;


