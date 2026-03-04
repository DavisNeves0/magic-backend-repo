import express from "express";
import cors from "cors";
import routes from "./router.js";
import mongoose from "mongoose";

class App {
  constructor() {
    this.server = express();

    this.databaseConnection();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
    this.server.use(cors());
  }

  routes() {
    this.server.use(routes);
  }

  databaseConnection() {
    try {
      mongoose.connect(process.env.DATABASE_CONNECTION_STRING);

      console.log("Database connection successful");
    } catch (error) {
      console.error("Database connection error:", error);
    }
  }
}

export default new App().server;
