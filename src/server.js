import express from "express";
import cors from "cors";
import categoriesRouter from "../routes/categoriesRouter.js";
import gamesRouter from "../routes/gamesRouter.js";
import customersRouter from "../routes/customersRouter.js";
import rentRouter from "../routes/rentalsRouter.js";

const server = express();

server.use(cors());
server.use(express.json());

server.use(categoriesRouter)
server.use(gamesRouter)
server.use(customersRouter)
server.use(rentRouter)

server.listen(4000, () => {
    console.log("something is happening on 4000")
})