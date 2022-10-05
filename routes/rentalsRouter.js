import express from "express";
import { list,create,deleteRoute,finish } from "../controllers/rentalsController.js";
import { rentCheck,finishRentCheck,deleteRentCheck } from "../middlewares/rentalsMiddleware.js";

const rentRouter = express.Router();

rentRouter.get("/rentals", list);
rentRouter.post("/rentals",rentCheck, create);
rentRouter.post("/rentals/:id/return",finishRentCheck, finish);
rentRouter.delete("/rentals/:id",deleteRentCheck, deleteRoute);

export default rentRouter;