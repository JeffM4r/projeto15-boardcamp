import connection from "../db/database.js";

async function list(req, res) {
    const { name } = req.query

    try {
        const db = await connection();
        
        if (name) {
            const gamesName = await db.query(`SELECT * FROM games WHERE name ILIKE $1;`, [name + "%"])
            res.status(200).send(gamesName.rows)
            return
        }

        const allGames = await db.query(`SELECT games.id,games.image,games."stockTotal",games.name,games."pricePerDay",games."categoryId",categories.name as "categoryName" FROM games JOIN categories ON games."categoryId" = categories.id;`)
        
        res.status(200).send(allGames.rows)
        return

    } catch (error) {
        res.status(500).send(error)
    }
}

async function create(req, res) {
    const game = res.locals.gameForm

    try {
        const db = await connection();
        await db.query(`INSERT INTO games ("name","image", "stockTotal", "categoryId", "pricePerDay") VALUES ($1,$2,$3,$4,$5);`, [game.name, game.image, game.stockTotal, game.categoryId, game.pricePerDay])
        return res.sendStatus(201)

    } catch (error) {
        res.status(500).send(error)
    }
}

export { list, create }