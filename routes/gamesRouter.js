import express from "express";
import { list,create } from "../controllers/gamesController.js";

const gamesRouter = express.Router();

gamesRouter.get("/games", list);
gamesRouter.post("/games", create);

export default gamesRouter;