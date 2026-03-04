import { Router } from "express";
import CardsController from "./controllers/CardsController.js";
import UserController from "./controllers/UserController.js";
import AuthController from "./controllers/AuthController.js";
import authMiddleware from "./middlewares/authMiddleware.js";

const routes = new Router();

//CARDS ROUTES
routes.get("/search", CardsController.search);

//HEALTH CHECK
routes.get("/health", async (req, res) => {
  try {
    return res.status(200).json({ message: "ok" });
  } catch (error) {
    console.error("Error", error);
  }
});

//USERS ROUTES
routes.post("/user-register", AuthController.register);
routes.post("/user-verification-code", AuthController.verifyCode);
routes.post("/user-login", AuthController.login);

//AUTH ROUTES
routes.get("/me", authMiddleware, UserController.get);

export default routes;
