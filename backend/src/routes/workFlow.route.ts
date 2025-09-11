import { Router } from "express";
import {
  createWorkFlowWithChild,
  getWorkFlows,
  checkWorkFlowActiveExists,
  changeStatus,
  getWorkflowByStatusByModule,
} from "../controllers/workFlow.controller.js";

const workFlowRouter = Router();

workFlowRouter.post("/", createWorkFlowWithChild);
workFlowRouter.get("/", getWorkFlows);
workFlowRouter.get("/:module/:status/exists", checkWorkFlowActiveExists);
workFlowRouter.put("/:mainId", changeStatus);
workFlowRouter.get("/:module/:status/workflow", getWorkflowByStatusByModule);

export default workFlowRouter;
