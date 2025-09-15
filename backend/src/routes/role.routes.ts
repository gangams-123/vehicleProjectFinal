// src/routes/workflow.routes.ts
import express, { Router } from "express";
import { RoleController } from "../controller/role.controller.js";
import { Role } from "../entity/role.js";
import { AppDataSource } from "../data/data-source.js";
import { RoleService } from "../service/role.service.js";

export function createRoleRoutes(): Router {
  const roleRepo = AppDataSource.getRepository(Role);
  const roleService = new RoleService(roleRepo);
  const controller = new RoleController(roleService);

  const router = express.Router();

  router.post("/roles", controller.createRole);
  router.get("/roles/all", controller.getAllRoles);
  router.get("/roles", controller.getRoles);
  router.get("/roles/:id", controller.getRoleById);
  router.put("/roles/:id", controller.updateRole);
  router.delete("/roles/:id", controller.deleteRole);

  return router;
}
