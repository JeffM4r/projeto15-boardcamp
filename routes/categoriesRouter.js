import express from "express";
import { list,create } from "../controllers/categoriesController.js";

const categoriesRouter = express.Router();

categoriesRouter.get("/categories", list);
categoriesRouter.post("/categories", create);

export default categoriesRouter;