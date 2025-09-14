// src/routes/auth.routes.ts
import { Router } from "express";
import { AppDataSource } from "../data/data-source.js";
import { AuthService } from "../service/auth.service.js";
import { AuthController } from "../controller/auth.controller.js";
import { Official } from "../entity/official.js";
export function createAuthRoutes(): Router {
  const router = Router();

  const officialRepo = AppDataSource.getRepository(Official);
  const authService = new AuthService(officialRepo);
  const authController = new AuthController(authService);

  router.post("/login", authController.login);

  return router;
}
