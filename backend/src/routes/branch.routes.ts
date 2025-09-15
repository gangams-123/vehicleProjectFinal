import { Router } from "express";
import multer from "multer";
import { BranchController } from "../controller/branch.controller.js";
import { BranchService } from "../service/branch.service.js";
import { AddressService } from "../service/address.service.js";
import { AppDataSource } from "../data/data-source.js";
import { Branch } from "../entity/branch.js";
import { Address } from "../entity/address.js";
import { File } from "../entity/file.js";
import { FileService } from "../service/file.service.js";

export function createBranchRoutes(): Router {
  const branchRepo = AppDataSource.getRepository(Branch);
  const addressRepo = AppDataSource.getRepository(Address);
  const fileRepo = AppDataSource.getRepository(File);

  const addressService = new AddressService(addressRepo);
  const fileService = new FileService(fileRepo);
  const branchService = new BranchService(
    branchRepo,
    addressService,
    fileService
  );
  const branchController = new BranchController(branchService);

  const router = Router();
  const storage = multer.memoryStorage();
  const upload = multer({
    storage,
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB max per file
      files: 5, // max 5 files
    },
  });

  router.post("/branches", upload.array("files", 5), (req, res) =>
    branchController.createBranch(req, res)
  );
  router.get("/branches/all", (req, res) =>
    branchController.getAllBranches(req, res)
  );
  router.get("/branches", (req, res) =>
    branchController.getBranchPaginated(req, res)
  );

  return router;
}
