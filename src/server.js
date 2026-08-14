// Responsible for starting the server.

import app from './app.js';
import { config } from './config/config.js';

app.get('/', async (req, res)=>{
    // const result = await pool.query("SELECT NOW()");
    res.json(
        {
            message: 'Task manager API is running!'
            // database_time: result.rows[0].now
        }
    );
});

app.listen(config.port, ()=> {console.log("server live on http://localhost:3000")})

