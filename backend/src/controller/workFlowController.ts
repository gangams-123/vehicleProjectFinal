// src/controller/workflow.controller.ts
import { Request, Response } from "express";
import { AppDataSource } from "../data/data-source.js";
import { WorkFlowService } from "../service/workFlowService.js";

export class WorkflowController {
  private workflowService: WorkFlowService;

  constructor(workflowService: WorkFlowService) {
    this.workflowService = workflowService;
  }
  create = async (req: Request, res: Response) => {
    try {
      const workflow = await this.workflowService.createWorkFlowWithChild(
        req.body
      );
      res.status(201).json({ message: "Workflow created", data: workflow });
    } catch (error) {
      console.error("Error creating workflow:", error);
      res.status(500).json({ message: "Failed to create workflow" });
    }
  };

  getAll = async (req: Request, res: Response) => {
    try {
      const page = parseInt((req.query.page as string) ?? "1");
      const size = parseInt((req.query.limit as string) ?? "10");
      const status = req.query.status?.toString() ?? "active";

      const result = await this.workflowService.getWorkFlows({
        page,
        size,
        status,
      });
      res.json(result);
    } catch (error) {
      console.error("Error fetching workflows:", error);
      res.status(500).json({ message: "Failed to fetch workflows" });
    }
  };

  checkExists = async (req: Request, res: Response) => {
    try {
      const module = req.params.module;
      const status = req.params.status;
      const exists = await this.workflowService.checkWorkFlowActiveExists(
        module,
        status
      );
      if (exists) {
        return res.status(200).json({ message: "Workflow exists" });
      } else {
        return res.status(404).json({ message: "No workflow found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error checking workflow" });
    }
  };

  changeStatus = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.mainId);
      const { status } = req.body;
      const affected = await this.workflowService.changeStatus(id, status);
      if (!affected) {
        return res.status(404).json({ message: "No workflow updated" });
      }
      res.json({ message: "Status updated" });
    } catch (error) {
      res.status(500).json({ message: "Error updating status" });
    }
  };

  getByModuleAndStatus = async (req: Request, res: Response) => {
    try {
      const module = req.params.module;
      const status = req.params.status;

      const grouped = await this.workflowService.getWorkflowByStatusByModule(
        module,
        status
      );
      if (!grouped) {
        return res.status(404).json({ message: "Workflow not found" });
      }
      res.json({ data: grouped });
    } catch (error) {
      res.status(500).json({ message: "Error fetching workflow" });
    }
  };
}
