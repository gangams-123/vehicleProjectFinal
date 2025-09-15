import { Request, Response } from "express";
import { BranchService } from "../service/branch.service.js";

export class BranchController {
  private branchService: BranchService;

  constructor(branchService: BranchService) {
    this.branchService = branchService;
  }

  async createBranch(req: Request, res: Response) {
    try {
      console.log(req.body);
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
  // GET /branches/:idyed
  async getBranchPaginated(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const { total, data } = await this.branchService.getBranchesPaginated(
        page,
        limit
      );

      res.json({ page, limit, total, data });
    } catch (error) {
      console.error("Error fetching branch:", error);
      res.status(500).json({ error: "Failed to fetch branch." });
    }
  }
  async getAllBranches(req: Request, res: Response) {
    try {
      const { data } = await this.branchService.getAllBranches();
      res.json({ data });
    } catch (error: any) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
