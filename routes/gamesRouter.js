import express from "express";
import { list,create } from "../controllers/gamesController.js";
import { checkForm } from "../middlewares/gamesMiddleware.js";

const gamesRouter = express.Router();

gamesRouter.get("/games", list);
gamesRouter.post("/games",checkForm, create);

export default gamesRouter;