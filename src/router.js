import { Router } from "express";
import CardsController from "./controllers/CardsController.js";
import UserController from "./controllers/UserController.js";

const routes = new Router();

routes.get("/search", CardsController.search);
routes.post("/users", UserController.create);

export default routes;
