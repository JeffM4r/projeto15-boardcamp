import connection from "../db/database";

async function list(req, res) {
    const { name } = req.query

    try {
        const db = connection();
        if (name) {
            const ganmesName = await db.query(`SELECT * FROM games WHERE name ILIKE $1;`, [name])
            res.status(200).send(ganmesName.rows)
            return
        }

        const games = await db.query(`SELECT * FROM games;`)
        res.status(200).send(games.rows)
        return

    } catch (error) {
        res.status(500).send(error)
    }
}

async function create(req, res) {
    const game = req.body

    try {
        const db = await connection();
        await db.query(`INSERT INTO games ("name","image", "stockTotal", "categoryId", "pricePerDay") VALUES ($1,$2,$3,$4,$5);`, [game.name, game.image, game.stockTotal, game.categoryId, game.pricePerDay])
        return res.sendStatus(201)

    } catch (error) {
        res.status(500).send(error)
    }
}

export { list, create }