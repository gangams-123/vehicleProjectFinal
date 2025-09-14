import { Router } from "express";
import { VendorController } from "../controller/vendor.controller.js";
import { VendorService } from "../service/vendor.service.js";
import { AddressService } from "../service/address.service.js";
import { AppDataSource } from "../data/data-source.js";
import { Vendor } from "../entity/vendor.js";
import { Address } from "../entity/address.js";

export function createVendorRoutes(): Router {
  const vendorRepo = AppDataSource.getRepository(Vendor);
  const addressRepo = AppDataSource.getRepository(Address);

  const addressService = new AddressService(addressRepo);
  const vendorService = new VendorService(vendorRepo, addressService);
  const vendorController = new VendorController(vendorService);

  const router = Router();

  router.post("/vendors", (req, res) =>
    vendorController.createVendor(req, res)
  );
  router.get("/vendors", (req, res) => vendorController.getVendors(req, res));
  return router;
}
