import { Router } from "express";
import {
  createExpense,
  upload,
  getExpensesNextStepForRole,
} from "../controllers/expense.controller.js";

const expenseRouter = Router();
expenseRouter.post("/", upload.array("files", 10), createExpense);
expenseRouter.get("/:roleId/:deptId", getExpensesNextStepForRole);

export default expenseRouter;
