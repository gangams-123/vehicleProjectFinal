// src/branch/branch.controller.ts

import { Request, Response } from "express";
import { BranchService } from "../service/branch.service.js";

export class BranchController {
  private branchService: BranchService;

  constructor(branchService: BranchService) {
    this.branchService = branchService;
  }

  async createBranch(req: Request, res: Response) {
    try {
      const branchData = JSON.parse(req.body.branchData);
      const addressData = JSON.parse(req.body.addressData);

      const files = req.files as Express.Multer.File[];

      const result = await this.branchService.createBranchWithAddressAndFiles(
        branchData,
        addressData,
        files
      );

      res.status(201).json(result);
    } catch (error) {
      console.error("Error creating branch:", error);
      res.status(500).json({ error: "Failed to create branch." });
    }
  }
  // GET /branches/:id
  async getBranch(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const result = await this.branchService.getBranchWithAddresses(id);

      if (!result) {
        return res.status(404).json({ error: "Branch not found" });
      }

      res.json(result);
    } catch (error) {
      console.error("Error fetching branch:", error);
      res.status(500).json({ error: "Failed to fetch branch." });
    }
  }

  // You can add update/delete methods here later
}
