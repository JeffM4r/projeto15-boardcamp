import joi from "joi";
import connection from "../db/database.js";

const nameSchema = joi.object({
    name: joi.string().required()
});

async function checkName(req, res, next) {
    const name = req.body
    const validateName = nameSchema.validate(name)

    if (validateName.error) {
        res.sendStatus(400)
        return;
    } 

    try {
        const db = await connection();
        const checkIfExist = await db.query("SELECT * FROM categories WHERE name=$1",[name.name])
        
        if(checkIfExist.rows.length>0){
            res.sendStatus(409)
            return;
        }

    } catch (error) {
        res.status(500).send(error)
    }

    res.locals.name = req.body;
    next();
}

export { checkName }