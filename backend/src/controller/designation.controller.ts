import { Request, Response } from "express";
import { DesignationService } from "../service/designation.service.js";

export class DesignationController {
  private designationService: DesignationService;

  constructor(designationService: DesignationService) {
    this.designationService = designationService;
  }

  async createDesignation(req: Request, res: Response) {
    try {
      const designation = await this.designationService.createDesignation(
        req.body
      );
      res.status(201).json(designation);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getDesignations(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const { data, total } =
        await this.designationService.getDesignationsPaginated(page, limit);

      res.json({
        page,
        limit,
        total,
        data,
      });
    } catch (error: any) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async getDesignationById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const designation = await this.designationService.getDesignationById(id);

      if (!designation) {
        return res.status(404).json({ error: "Designation not found" });
      }

      res.json(designation);
    } catch (error: any) {
      res.status(400).json({ error: "Invalid ID" });
    }
  }

  async updateDesignation(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const designation = await this.designationService.updateDesignation(
        id,
        req.body
      );

      if (!designation) {
        return res.status(404).json({ error: "Designation not found" });
      }

      res.json(designation);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteDesignation(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const result = await this.designationService.deleteDesignation(id);

      if (result.affected === 0) {
        return res.status(404).json({ error: "Designation not found" });
      }

      res.status(204).json({ message: "Designation deleted successfully" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
