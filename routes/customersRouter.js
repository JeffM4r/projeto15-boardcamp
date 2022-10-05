import express from "express";
import { list,create,update } from "../controllers/customersController.js";
import { checkFormCustomers,checkFormCustomersUpdate } from "../middlewares/customersMiddleware.js";

const customersRouter = express.Router();

customersRouter.get("/customers", list);
customersRouter.get("/customers/:id", list);
customersRouter.post("/customers",checkFormCustomers, create);
customersRouter.put("/customers/:id",checkFormCustomersUpdate, update);

export default customersRouter;