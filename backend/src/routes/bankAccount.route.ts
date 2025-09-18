// src/routes/workflow.routes.ts
import express, { Router } from "express";
import { BankAccountController } from "../controller/bankAccount.controller.js";

import { AppDataSource } from "../data/data-source.js";
import { BankAccountService } from "../service/bankAccount.service.js";
import { File } from "../entity/file.js";
import { FileService } from "../service/file.service.js";
import multer from "multer";

export function createBankAccountRoutes(): Router {
  const fileRepo = AppDataSource.getRepository(File);
  const fileService = new FileService(fileRepo);
  const bankAccountService = new BankAccountService(AppDataSource, fileService);
  const controller = new BankAccountController(bankAccountService);

  const router = express.Router();
  const storage = multer.memoryStorage();
  const upload = multer({
    storage,
    limits: {
      fileSize: 10 * 1024 * 1024,
      files: 5,
    },
  });

  router.post("/bankAccounts", upload.array("files", 5), (req, res) =>
    controller.createBankAccount(req, res)
  );
  router.get("/bankAccounts", (req, res) =>
    controller.getBankAccountPaginated(req, res)
  );

  return router;
}
