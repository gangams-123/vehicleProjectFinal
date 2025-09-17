import { Request, Response } from "express";

import { ExpenseService } from "../service/expense.service.js";

export class ExpenseController {
  private expenseService: ExpenseService;

  constructor(workflowService: ExpenseService) {
    this.expenseService = workflowService;
  }

  getExpensesForApproval = async (req: Request, res: Response) => {
    try {
      const roleId = req.params.roleId;
      const deptId = req.params.deptId;

      const { items } = await this.expenseService.getExpensesForApproval(
        roleId,
        deptId
      );

      res.json({ data: items });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error fetching expenses" });
    }
  };
  createExpense = async (req: Request, res: Response) => {
    try {
      const expenseData = JSON.parse(req.body.expenseData);
      const files = req.files as Express.Multer.File[];
      const workflow = await this.expenseService.createExpense(
        expenseData,
        files
      );
      res.status(201).json({ message: "Expense created", data: workflow });
    } catch (error) {
      console.error("Error creating expense:", error);
      res.status(500).json({ message: "Failed to create workflow" });
    }
  };
  updateExpenseAndAddChild = async (req: Request, res: Response) => {
    try {
      const expenseData = JSON.parse(req.body.expenseData);
      const files = req.files as Express.Multer.File[];
      const workflow = await this.expenseService.updateExpenseAndAddChild(
        expenseData,
        files
      );
      res.status(201).json({ message: "Expense created", data: workflow });
    } catch (error) {
      console.error("Error creating expense:", error);
      res.status(500).json({ message: "Failed to create workflow" });
    }
  };
}
