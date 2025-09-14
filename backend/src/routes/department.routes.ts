import { Router } from "express";
import { DepartmentController } from "../controller/department.controller.js";
import { DepartmentService } from "../service/department.service.js";
import { getRepository } from "typeorm";
import { Department } from "../entity/department.js";
import { AppDataSource } from "../data/data-source.js";

const router = Router();

export function createDepartmentRoutes(): Router {
  const departmentRepo = AppDataSource.getRepository(Department);
  const departmentService = new DepartmentService(departmentRepo);

  const controller = new DepartmentController(departmentService);
  router.post("/departments", controller.createDepartment);
  router.get("/departments/all", controller.getAllDepartments);
  router.get("/departments", controller.getDepartments);
  router.get("/departments/:id", controller.getDepartmentById);
  router.put("/departments/:id", controller.updateDepartment);
  router.delete("/departments/:id", controller.deleteDepartment);

  return router;
}
