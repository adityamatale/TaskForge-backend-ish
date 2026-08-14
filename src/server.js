// Responsible for starting the server.

import app from './app.js';
import { config } from './config/config.js';
import logger from "./utils/logger.js";

app.get('/', async (req, res)=>{
    // const result = await pool.query("SELECT NOW()");
    res.json(
        {
            message: 'Task manager API is running!'
            // database_time: result.rows[0].now
        }
    );
});

app.listen(config.port, ()=> {logger.info(`Server running on port ${config.port} | http://localhost:3000`)})

