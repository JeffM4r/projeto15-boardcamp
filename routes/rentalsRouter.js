import express from "express";
import { list,create,deleteRoute,finish } from "../controllers/rentalsController.js";

const rentRouter = express.Router();

rentRouter.get("/rentals", list);
rentRouter.post("/rentals", create);
rentRouter.post("/rentals/:id/return", finish);
rentRouter.delete("/rentals/:id", deleteRoute);

export default rentRouter;