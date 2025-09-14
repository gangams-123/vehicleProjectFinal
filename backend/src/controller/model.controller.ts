import { Request, Response } from "express";
import { ModelService } from "../service/model.service.js";

export class ModelController {
  private modelService: ModelService;

  constructor(modelService: ModelService) {
    this.modelService = modelService;
  }

  async createModel(req: Request, res: Response) {
    try {
      const model = await this.modelService.createModel(req.body);
      res.status(201).json(model);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getModels(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const { data, total } = await this.modelService.getModelsPaginated(
        page,
        limit
      );

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

  async getModelById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const model = await this.modelService.getModelById(id);

      if (!model) {
        return res.status(404).json({ error: "Model not found" });
      }

      res.json(model);
    } catch (error: any) {
      res.status(400).json({ error: "Invalid ID" });
    }
  }

  async updateModel(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const model = await this.modelService.updateModel(id, req.body);

      if (!model) {
        return res.status(404).json({ error: "Model not found" });
      }

      res.json(model);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteModel(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const result = await this.modelService.deleteModel(id);

      if (result.affected === 0) {
        return res.status(404).json({ error: "Model not found" });
      }

      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
