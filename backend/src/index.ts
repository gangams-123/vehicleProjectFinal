// src/index.ts

import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();

import { AppDataSource } from "./data/data-source.js";
import { App } from "./app.js";

(async () => {
  try {
    // Initialize database
    await AppDataSource.initialize();
    await AppDataSource.synchronize(false);
    console.log("✅ Database connected");

    // Start Express app
    const port = parseInt(process.env.PORT || "5000");
    const appInstance = new App(port);
    appInstance.start();
  } catch (error) {
    console.error(" Failed to start application:", error);
    process.exit(1);
  }
})();
