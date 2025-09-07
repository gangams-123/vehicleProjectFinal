import { Router } from "express";
import {createWorkFlowWithChild,getWorkFlows,getWorkFlowByModule,changeStatus} from "../controllers/workFlow.controller.js";

const workFlowRouter = Router();

workFlowRouter.post("/", createWorkFlowWithChild);
workFlowRouter.get("/", getWorkFlows);
workFlowRouter.get("/:module/:status/exists", getWorkFlowByModule);
workFlowRouter.put("/:mainId",changeStatus)

export default workFlowRouter;
