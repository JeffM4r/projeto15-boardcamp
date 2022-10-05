import joi from "joi";
import connection from "../db/database.js";

const rentSchema = joi.object({
    customerId: joi.number().required(),
    gameId: joi.number().required(),
    daysRented: joi.number().required().positive()
});

async function rentCheck(req, res, next) {
    const register = req.body
    const validateRegister = rentSchema.validate(register)

    if (validateRegister.error) {
        res.sendStatus(400)
        return;
    }


    try {
        const db = await connection();
        const checkGame = await db.query("SELECT * FROM games WHERE id=$1", [register.gameId])

        if (checkGame.rows.length == 0) {
            res.sendStatus(400)
            return
        }

        const checkCustomer = await db.query(`SELECT * FROM customers WHERE id = $1;`, [register.customerId])

        if (checkCustomer.rows.length == 0) {
            res.sendStatus(400)
            return
        }

        const rents = await db.query('SELECT * FROM rentals WHERE "gameId"=$1', [register.gameId])

        if (checkGame.rows[0].stockTotal <= rents.rows.length) {
            console.log(checkCustomer)
            return res.sendStatus(400)
        }

        next()

    } catch (error) {
        res.status(500).send(error)
        return
    }

}

async function finishRentCheck(req, res, next) {
    const id = req.params

    try {

        const db = await connection();

        const rental = await db.query('SELECT * FROM rentals WHERE id=$1', [Number(id.id)])

        if (rental.rows.length === 0) {
            res.sendStatus(404)
            return
        }
        else if (rental.rows[0].returnDate) {

            res.sendStatus(400)
            return
        }
        next()
    } catch (error) {

        res.status(500).send(error)
        return
    }
}

async function deleteRentCheck(req, res, next) {
    const id = req.params

    try {
        const db = await connection();
        const rental = await db.query('SELECT * FROM rentals WHERE id=$1', [Number(id.id)])

        if (rental.rows.length === 0) {
            res.sendStatus(404)
            return

        } else if (!rental.rows[0].returnDate) {

            res.sendStatus(400)
            return
        }

        next()

    } catch (error) {
        res.status(500).send(error)
        return
    }
}

export { rentCheck, finishRentCheck, deleteRentCheck }