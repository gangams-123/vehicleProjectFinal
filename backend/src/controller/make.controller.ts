import { Request, Response } from "express";
import { MakeService } from "../service/make.service.js";

export class MakeController {
  private makeService: MakeService;

  constructor(makeService: MakeService) {
    this.makeService = makeService;
  }

  createMake = async (req: Request, res: Response) => {
    try {
      const make = await this.makeService.createMake(req.body);
      res.status(201).json(make);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  getMakes = async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const { data, total } = await this.makeService.getMakesPaginated(
        page,
        limit
      );

      res.json({ page, limit, total, data });
    } catch (error: any) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  getMakeById = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const make = await this.makeService.getMakeById(id);
      if (!make) {
        return res.status(404).json({ error: "Make not found" });
      }
      res.json(make);
    } catch (error: any) {
      res.status(400).json({ error: "Invalid ID" });
    }
  };

  updateMake = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const make = await this.makeService.updateMake(id, req.body);
      if (!make) {
        return res.status(404).json({ error: "Make not found" });
      }
      res.json(make);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  deleteMake = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const result = await this.makeService.deleteMake(id);
      if (result.affected === 0) {
        return res.status(404).json({ error: "Make not found" });
      }
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
}
