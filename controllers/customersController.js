import connection from "../db/database.js";

async function list(req, res) {
    const { cpf } = req.query
    const { id } = req.params
    try {
        const db = await connection();

        if (id) {
            const client = await db.query(`SELECT * FROM customers WHERE id = $1;`, [id])
            if (client.rows.length === 0) {
                res.sendStatus(404)
                return
            }
            res.status(200).send(client.rows[0])
            return
        }

        if (cpf) {
            const client = await db.query(`SELECT * FROM customers WHERE cpf = $1;`, [cpf])
            res.status(200).send(client.rows)
            return
        }

        const clients = await db.query(`SELECT * FROM customers;`)
        res.status(200).send(clients.rows)

    } catch (error) {
        res.status(500).send(error)
        return
    }
}

async function create(req, res) {
    const client = req.body
    const clientFound = ""
    try {
        const db = await connection();
        
        if (clientFound.length !== 0) {
            res.sendStatus(409)
            return
        }
        await db.query(`INSERT INTO customers ("name","cpf","phone","birthday") VALUES ($1,$2,$3,$4);`, [client.name, client.cpf, client.phone, client.birthday])
        res.sendStatus(201)
        return

    } catch (error) {
        res.status(500).send(error)
        return
    }
}

async function update(req, res) {
    const { id } = req.params
    const clientUpdate = req.body

    try {
        const db = await connection()
        db.query('UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday=$4 WHERE id=$5', [clientUpdate.name, clientUpdate.phone, clientUpdate.cpf, clientUpdate.birthday, id])
        res.sendStatus(200)
        return

    } catch (error) {
        res.status(500).send(error)
        return
    }
}


export { list, create, update }