// src/routes/workflow.routes.ts
import express, { Router } from "express";
import { ExpenseController } from "../controller/expense.controller.js";

import { AppDataSource } from "../data/data-source.js";
import { ExpenseService } from "../service/expense.service.js";
import { File } from "../entity/file.js";
import { FileService } from "../service/file.service.js";
import multer from "multer";

export function createExpenseRoutes(): Router {
  // const expenseRepo = AppDataSource.getRepository(Expense);
  //  const expenseChildRepo = AppDataSource.getRepository(ExpenseChild);
  const fileRepo = AppDataSource.getRepository(File);
  const fileService = new FileService(fileRepo);
  const expenseService = new ExpenseService(AppDataSource, fileService);
  const controller = new ExpenseController(expenseService);

  const router = express.Router();
  const storage = multer.memoryStorage();
  const upload = multer({
    storage,
    limits: {
      fileSize: 10 * 1024 * 1024,
      files: 5,
    },
  });

  router.post("/expenses", upload.array("files", 5), (req, res) =>
    controller.createExpense(req, res)
  );
  router.get("/expenses/:roleId/:deptId", controller.getExpensesForApproval);
  router.put("/expenses", upload.array("files", 5), (req, res) =>
    controller.updateExpenseAndAddChild(req, res)
  );

  return router;
}
