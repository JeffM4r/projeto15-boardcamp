import express from "express";
import { list,create } from "../controllers/categoriesController.js";
import { checkName } from "../middlewares/categoriesMiddleware.js";

const categoriesRouter = express.Router();

categoriesRouter.get("/categories", list);
categoriesRouter.post("/categories",checkName, create);

export default categoriesRouter;