import joi from "joi";
import connection from "../db/database.js";
import dayjs from "dayjs";

const formSchema = joi.object({
    name: joi.string().required(),
    phone: joi.string().min(10).max(11).required(),
    cpf: joi.string().min(11).required(),
    birthday: joi.string()
});

async function checkFormCustomers(req, res, next) {
    const form = req.body
    const validateForm = formSchema.validate(form)

    if (validateForm.error) {
        res.sendStatus(400)
        return;
    }
    
    if(dayjs(form.birthday).format('YYYY-MM-DD') !== form.birthday){
        return res.sendStatus(400)
    }

    try {
        const db = await connection();        
        const clientFound = await db.query("SELECT * FROM customers WHERE cpf=$1",[form.cpf])
        
        if (clientFound.rows.length > 0) {
            res.sendStatus(409)
            return
        }

    } catch (error) {
        res.status(500).send(error)
    }

    res.locals.client = req.body;
    next();
}

async function checkFormCustomersUpdate(req, res, next) {
    const form = req.body
    const {id} = req.params
    const validateForm = formSchema.validate(form)

    if (validateForm.error) {
        res.sendStatus(400)
        return;
    }
    
    
    if(dayjs(form.birthday).format('YYYY-MM-DD') !== form.birthday){
        return res.sendStatus(400)
    }

    

    try {
        const db = await connection();       
        const clientFound = await db.query("SELECT * FROM customers WHERE cpf = $1",[form.cpf]);
        
        if(clientFound.rows.length > 0 ){

            if (clientFound.rows[0].id != id) {
                res.sendStatus(409)
                return
            }

        }
        

    } catch (error) {
        res.status(500).send(error)
    }

    res.locals.client = req.body;
    next();
}

export { checkFormCustomers, checkFormCustomersUpdate }