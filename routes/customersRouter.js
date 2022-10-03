import express from "express";
import { list,create,update } from "../controllers/customersController.js";

const customersRouter = express.Router();

customersRouter.get("/customers", list);
customersRouter.get("/customers/:id", list);
customersRouter.post("/customers", create);
customersRouter.put("/customers/:id", update);

export default customersRouter;