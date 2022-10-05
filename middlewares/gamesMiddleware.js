import joi from "joi";
import connection from "../db/database.js";

const formSchema = joi.object({
    name: joi.string().required(),
    image: joi.string().allow(''),
    stockTotal: joi.number().positive(),
    categoryId: joi.number(),
    pricePerDay: joi.number().positive()
});

async function checkForm(req, res, next) {
    const form = req.body
    const validateForm = formSchema.validate(form)

    if (validateForm.error) {
        res.sendStatus(400)
        return;
    }

    try {
        const db = await connection();
        const checkCategory = await db.query("SELECT * FROM categories WHERE id=$1", [form.categoryId])

        if (checkCategory.rows.length === 0) {
            res.sendStatus(400)
            return;
        }

        const checkIfExist = await db.query("SELECT * FROM games WHERE name=$1", [form.name])

        if (checkIfExist.rows.length > 0) {
            res.sendStatus(409)
            return;
        }

    } catch (error) {
        res.status(500).send(error)
        return
    }

    res.locals.gameForm = req.body;
    next();
}

export { checkForm }