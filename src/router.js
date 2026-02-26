import { Router } from "express";
import CardsController from "./controllers/CardsController.js";
import UserController from "./controllers/UserController.js";
import AuthController from "./controllers/AuthController.js";
import authMiddleware from "./middlewares/authMiddleware.js";

const routes = new Router();

routes.get("/search", CardsController.search);

routes.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

routes.post("/user-register", AuthController.register);
routes.post("/user-login", AuthController.login);

//AUTH ROTES
routes.get("/me", authMiddleware, UserController.get);

export default routes;
