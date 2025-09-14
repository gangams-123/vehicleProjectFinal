import { Router } from "express";
import { Make } from "../entity/make.js";
import { MakeService } from "../service/make.service.js";
import { MakeController } from "../controller/make.controller.js";
import { AppDataSource } from "../data/data-source.js";

const router = Router();
export function createMakeRoutes(): Router {
  const makeRepo = AppDataSource.getRepository(Make);
  const makeService = new MakeService(makeRepo);
  const makeController = new MakeController(makeService);

  router.post("/makes", (req, res) => makeController.createMake(req, res));
  router.get("/makes", (req, res) => makeController.getMakes(req, res));
  router.get("/makes/:id", (req, res) => makeController.getMakeById(req, res));
  router.put("/makes/:id", (req, res) => makeController.updateMake(req, res));
  router.delete("/designations/:id", (req, res) =>
    makeController.deleteMake(req, res)
  );

  return router;
}
