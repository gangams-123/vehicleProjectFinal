// src/branch/branch.controller.ts

import { Request, Response } from "express";
import { VendorService } from "../service/vendor.service.js";

export class VendorController {
  private vendorService: VendorService;

  constructor(vendorService: VendorService) {
    this.vendorService = vendorService;
  }

  // POST /branches
  async createVendor(req: Request, res: Response) {
    try {
      const vendorData = JSON.parse(req.body.vendorData); // Assuming sent as JSON string
      const addressData = JSON.parse(req.body.vendorData); // Same here

      const result = await this.vendorService.createVendorWithAddress(
        vendorData,
        addressData
      );

      res.status(201).json(result);
    } catch (error) {
      console.error("Error creating vendor:", error);
      res.status(500).json({ error: "Failed to create vedor." });
    }
  }
  // GET /branches/:id
  async getVendors(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const result = await this.vendorService.getVendorWithAddresses(id);

      if (!result) {
        return res.status(404).json({ error: "vendor not found" });
      }

      res.json(result);
    } catch (error) {
      console.error("Error fetching vendor:", error);
      res.status(500).json({ error: "Failed to fetch vendor." });
    }
  }
}
