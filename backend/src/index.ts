// src/index.ts

import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();

import { AppDataSource } from "./data/data-source.js";
import { App } from "./app.js"; // Assuming this is the class-based App

export class AppRunner {
  private port: number;

  constructor() {
    this.port = parseInt(process.env.PORT || "5000");
  }

  public async run() {
    try {
      await AppDataSource.initialize();
      await AppDataSource.synchronize(false);
      console.log("✅ Database connected");

      const appInstance = new App(this.port); // This starts the server inside the App class
    } catch (error) {
      console.error(" Failed to start application:", error);
      process.exit(1);
    }
  }
}

// If this file is being run directly, start the app
const runner = new AppRunner();
runner.run();
