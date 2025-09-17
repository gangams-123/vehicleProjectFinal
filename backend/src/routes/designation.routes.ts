import { Router } from "express";
import { Designation } from "../entity/designation.js";
import { DesignationService } from "../service/designation.service.js";
import { DesignationController } from "../controller/designation.controller.js";
import { AppDataSource } from "../data/data-source.js";

const router = Router();
export function createDesignationRoutes(): Router {
  const designationRepo = AppDataSource.getRepository(Designation);
  const designationService = new DesignationService(designationRepo);
  const designationController = new DesignationController(designationService);

  router.post("/designations", (req, res) =>
    designationController.createDesignation(req, res)
  );
  router.get("/designations", (req, res) =>
    designationController.getDesignations(req, res)
  );
  router.get("/designations/:id", (req, res) =>
    designationController.getDesignationById(req, res)
  );
  router.put("/designations/:id", (req, res) =>
    designationController.updateDesignation(req, res)
  );
  router.delete("/designations/:id", (req, res) =>
    designationController.deleteDesignation(req, res)
  );
  router.get("/designations/:departmentId/departments", (req, res) =>
    designationController.getDesignationsByDeptId(req, res)
  );

  return router;
}
