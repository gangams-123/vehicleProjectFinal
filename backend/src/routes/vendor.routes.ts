import { Router } from "express";
import { createVendorWithAddresses,getVendors,getVendorAddresses} from "../controllers/vendors.controller.js"

const vendorRouter = Router();

vendorRouter.post("/", createVendorWithAddresses);
vendorRouter.get("/", getVendors);
vendorRouter.get("/:vendorId/addresses", getVendorAddresses);

export default vendorRouter;
