import express from "express";
import pool from "../db.js";

const router = express.Router();

// get all tasks
router.get('/', async (req, res) => {
    const result = await pool.query("select * from tasks");

    res.json(result.rows);
});

//create a task
router.post('/', async (req, res) => {
    const {title, description} = req.body;
    const result = await pool.query(
        `
        INSERT INTO tasks(title, description) 
        VALUES ($1, $2) 
        RETURNING *
        `,
        [title, description]
    );
    
    res.status(201).json(result.rows[0]);
});


// get a single task
router.get('/:id', async (req, res) => {
    const {id} = req.params; // these are parameter variables
    const result = await pool.query(
        `
        SELECT * FROM tasks
        WHERE id = $1
        `,
        [id]
    );

    if(!result.rows.length) {
        return res.status(404).json({message: "task not found"});
    }

    res.json(result.rows[0]);
});

//patch a single task
router.patch('/:id', async (req, res)=>{
    const {id} = req.params;
    const {title, description, completed} = req.body;
    const result = await pool.query(
        `
        UPDATE tasks
        SET title = COALESCE($1, title),
            description = COALESCE($2, description),
            completed = COALESCE($3, completed)
        WHERE id = $4
        RETURNING *
        `,
        [title, description, completed, id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({message: "task not found"});
    };

    res.json(result.rows[0]);

});


// delete task
router.delete('/:id', async (req, res) =>{
    const {id} = req.params;
    const result = await pool.query(
        `
        DELETE FROM tasks
        WHERE id = $1
        RETURNING *
        `,
        [id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({message: "task not found"});
    };

    res.json({message: "task deleted successfully"});

});


export default router;


