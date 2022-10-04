import connection from "../db/database.js";

async function list(req, res){
    
    try{
        const db = await connection();
        const categories = await db.query("SELECT * FROM categories;");
        res.status(200).send(categories.rows);

    }catch(error){
        res.status(500).send(error)
    }
}

async function create(req, res){
    const name = req.body

    try {
        const db = await connection();
        await db.query(`INSERT INTO categories (name) VALUES ($1);`, [name.name]);
        res.sendStatus(201)
                
    } catch (error) {
        res.status(500).send(error)
    }
}

export {list, create}