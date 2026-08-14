import { ZodError } from "zod";


export function errorHandler(err, req, res, next){
    console.log(err);

    if (err instanceof ZodError) {
        return res.status(400).json({message: "Validation error!", errors: err.issues}); // .issues => is a property of zod error which explain the error
    }

    res.status(500).json({message: "Internal Server Error!"});
}
