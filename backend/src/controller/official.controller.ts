// src/branch/branch.controller.ts

import { Request, Response } from "express";
import { OfficialService } from "../service/official.service.js";

export class OfficialController {
  private officialService: OfficialService;

  constructor(officialService: OfficialService) {
    this.officialService = officialService;
  }

  // POST /branches
  async createOfficial(req: Request, res: Response) {
    try {
      const officialData = JSON.parse(req.body.officialData); // Assuming sent as JSON string
      const addressData = JSON.parse(req.body.officialData); // Same here

      const files = req.files as Express.Multer.File[];

      const result =
        await this.officialService.createOfficialWithAddressAndFiles(
          officialData,
          addressData,
          files
        );

      res.status(201).json(result);
    } catch (error) {
      console.error("Error creating official:", error);
      res.status(500).json({ error: "Failed to create official." });
    }
  }
  // GET /branches/:id
  async getOfficials(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const result = await this.officialService.getOfficialWithAddresses(id);

      if (!result) {
        return res.status(404).json({ error: "official not found" });
      }

      res.json(result);
    } catch (error) {
      console.error("Error fetching official:", error);
      res.status(500).json({ error: "Failed to fetch official." });
    }
  }
}
