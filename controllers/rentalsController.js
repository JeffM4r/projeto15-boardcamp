import connection from "../db/database.js";
import dayjs from "dayjs";

async function list(req, res) {
    const { customerId, gameId } = req.query

    try {
        const db = await connection()
        let list;

        if (gameId && customerId) {

            list = await db.query(`
            SELECT rentals.*, customers.id AS "customerId", customers.name AS "customerName", games.id AS "gameId",
                games.name AS "gameName", games."categoryId" AS "categoryId",categories.name AS "categoryName"
            FROM rentals
                JOIN customers ON rentals."customerId" = customers.id
                JOIN games ON rentals."gameId" = games.id
                JOIN categories ON games."categoryId" = categories.id
            WHERE rentals."gameId" = $1 
            AND rentals."customerId" = $2       
            `, [gameId, customerId])


        } else if (gameId) {

            list = await db.query(`
            SELECT rentals.*, customers.id AS "customerId", customers.name AS "customerName", games.id AS "gameId",
                games.name AS "gameName", games."categoryId" AS "categoryId",categories.name AS "categoryName"
            FROM rentals
                JOIN customers ON rentals."customerId" = customers.id
                JOIN games ON rentals."gameId" = games.id
                JOIN categories ON games."categoryId" = categories.id
            WHERE rentals."gameId" = $1        
            `, [gameId])

        } else if (customerId)  {

            list = await db.query(`
            SELECT rentals.*, customers.id AS "customerId", customers.name AS "customerName", games.id AS "gameId",
                games.name AS "gameName", games."categoryId" AS "categoryId",categories.name AS "categoryName"
            FROM rentals
                JOIN customers ON rentals."customerId" = customers.id
                JOIN games ON rentals."gameId" = games.id
                JOIN categories ON games."categoryId" = categories.id
            WHERE rentals."customerId" = $1        
            `, [customerId])

        } else{
            
            list = await db.query(`
            SELECT rentals.*, customers.id AS "customerId", customers.name AS "customerName", games.id AS "gameId",
                games.name AS "gameName", games."categoryId" AS "categoryId",categories.name AS "categoryName"
            FROM rentals
                JOIN customers ON rentals."customerId" = customers.id
                JOIN games ON rentals."gameId" = games.id
                JOIN categories ON games."categoryId" = categories.id        
            `)

        }

        console.log(list.rows)
        const rentalsList = list.rows.map(item => {
            return {
                id: item.id,
                customerId: item.customerId,
                gameId: item.gameId,
                rentDate: item.rentDate,
                daysRented: item.daysRented,
                returnDate: item.returnDate,
                originalReturnDate: item.originalReturnDate,
                originalPrice: item.originalPrice,
                delayFee: item.delayFee,
                customer: {
                    id: item.customerId,
                    name: item.customerName
                },
                game: {
                    id: item.gameId,
                    name: item.gameName,
                    categoryId: item.categoryId,
                    categoryName: item.categoryName
                }
            }
        })

        res.status(200).send(rentalsList)
        return

    } catch (error) {
        res.status(500).send(error)
        return

    }

}

async function create(req, res) {
    const rentItens = req.body
    const date = dayjs().format("YYYY-MM-DD")

    try {
        const db = await connection()
        const game = await db.query("SELECT * FROM games WHERE id=$1;", [rentItens.gameId])
        console.log(game.rows)
        console.log(rentItens)
        await db.query(`INSERT INTO rentals ("customerId","gameId","rentDate","daysRented","returnDate","originalPrice","delayFee") VALUES ($1,$2,$3,$4,$5,$6,$7)`,
            [rentItens.customerId, rentItens.gameId, date, rentItens.daysRented, null, (game.rows[0].pricePerDay * rentItens.daysRented), null]
        )
        res.sendStatus(201)
        return

    } catch (error) {
        res.status(500).send(error)
        return
    }
}

async function finish(req, res) {
    const id = req.params
    const date = dayjs().format("YYYY-MM-DD")

    try {
        const db = await connection()
        const rent = await db.query(`SELECT * FROM rentals WHERE id=$1`, [id.id])
        const teste = rent.rows[0].daysRented < (dayjs(rent.rows[0].rentDate).format("DD") - dayjs().format('DD'))
        
        
        if (rent.rows[0].daysRented < (dayjs(rent.rows[0].rentDate).format("DD") - dayjs().format('DD'))) {

            const delayFee = (dayjs(date).format("DD") - dayjs(rent.rows[0].rentDate).format("DD") - rent.rows[0].daysRented) * (rent.rows[0].originalPrice/rent.rows[0].daysRented)

            await db.query('UPDATE rentals SET "returnDate"=$1, "delayFee"= $3 WHERE id=$2', [date, id.id, delayFee])
            
        } else {
            await db.query('UPDATE rentals SET "returnDate"=$1, "delayFee"=$2 WHERE id=$3', [date, 0, id.id])
        }
        res.sendStatus(201)
        return

    } catch (error) {
        res.status(500).send(error)
        return
    }

}

async function deleteRoute(req, res) {
    const id = req.params
    try {
        const db = await connection()
        console.log(id)
        await db.query("DELETE FROM rentals WHERE id=$1;", [id.id])
        res.sendStatus(200)
        return

    } catch (error) {
        res.status(500).send(error)
        return
    }
}

export { list, create, finish, deleteRoute }