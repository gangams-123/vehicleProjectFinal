import { Router } from "express";
import multer from "multer";
import { OfficialController } from "../controller/official.controller.js";
import { OfficialService } from "../service/official.service.js";
import { AddressService } from "../service/address.service.js";
import { AppDataSource } from "../data/data-source.js";
import { Branch } from "../entity/branch.js";
import { Address } from "../entity/address.js";
import { File } from "../entity/file.js";
import { FileService } from "../service/file.service.js";
import { Official } from "../entity/official.js";

export function createOfficialRoutes(): Router {
  const officialRepo = AppDataSource.getRepository(Official);
  const addressRepo = AppDataSource.getRepository(Address);
  const fileRepo = AppDataSource.getRepository(File);

  const addressService = new AddressService(addressRepo);
  const fileService = new FileService(fileRepo);
  const officialService = new OfficialService(
    officialRepo,
    addressService,
    fileService
  );
  const officialController = new OfficialController(officialService);

  const router = Router();
  const storage = multer.memoryStorage();
  const upload = multer({
    storage,
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB max per file
      files: 5, // max 5 files
    },
  });

  router.post("/officials", upload.array("files", 5), (req, res) =>
    officialController.createOfficial(req, res)
  );
  router.get("/officials/:id", (req, res) =>
    officialController.getOfficials(req, res)
  );

  return router;
}
