import { Router } from "express";
import { AppDataSource } from "../data/data-source.js";
import { WorkFlowService } from "../service/workFlowService.js";
import { WorkflowController } from "../controller/workFlowController.js";
import { WorkFlowMain } from "../entity/workFlowMain.js";
import { WorkFlowChild } from "../entity/WorkFlowChild.js";

export function createWorkFlowRoutes(): Router {
  // Instantiate repositories
  const mainRepo = AppDataSource.getRepository(WorkFlowMain);
  const childRepo = AppDataSource.getRepository(WorkFlowChild);

  // Instantiate service with data source (as your service expects)
  const workFlowService = new WorkFlowService(AppDataSource);

  // Create controller with service instance
  const workflowController = new WorkflowController(workFlowService);

  // Create router and define routes
  const router = Router();

  router.post("/workflows", (req, res) => workflowController.create(req, res));
  router.get("/workflows", (req, res) => workflowController.getAll(req, res));
  router.get("/workflows/:module/:status/exists", (req, res) =>
    workflowController.checkExists(req, res)
  );
  router.put("/workflows/status/:mainId", (req, res) =>
    workflowController.changeStatus(req, res)
  );
  router.get("/workflows/:module/:status", (req, res) =>
    workflowController.getByModuleAndStatus(req, res)
  );

  return router;
}
