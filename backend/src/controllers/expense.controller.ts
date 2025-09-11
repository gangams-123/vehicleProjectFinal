import { Request, Response } from "express";
import sequelize from "../config/db.js";
import Expense from "../models/expense.model.js";
import ExpenseChild from "../models/expense.child.model.js";
import multer from "multer";
import File from "../models/file.model.js";
import { col, literal, Op } from "sequelize";
import WorkFlowChild from "../models/workFlowChild.model.js";
import WorkFlowMain from "../models/workFlowMain.model.js";
const storage = multer.memoryStorage();
export const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 },
});
export const createExpense = async (req: Request, res: Response) => {
  const t = await sequelize.transaction();
  try {
    const { workflow, ...expense } = req.body;
    console.log(req.body);
    let expensedetails: ExpenseChild;
    let newFiles: File[] = [];
    const newExpense = await Expense.create(expense, { transaction: t });
    const workflowData = {
      ...JSON.parse(workflow),
      expenseId: newExpense.id,
    };
    expensedetails = await ExpenseChild.create(workflowData, {
      transaction: t,
    });
    const files = req.files as Express.Multer.File[];
    await Promise.all(
      files.map((file) =>
        File.create(
          {
            fileName: file.originalname,
            size: file.size,
            content: file.buffer,
            fileType: file.mimetype,
            entityType: "expense",
            entityId: newExpense.id,
          },
          { transaction: t }
        )
      )
    );
    await t.commit();
    res.status(201).json({
      message: "expense created successfully",
    });
  } catch (error) {
    await t.rollback();
    console.error("Error creating expense:", error);
    res.status(500).json({ message: "Failed to create expense", error });
  }
};
export const getExpensesNextStepForRole = async (
  req: Request,
  res: Response
) => {
  try {
    const roleId = Number(req.params.roleId);
    const deptId = Number(req.params.deptId);
    const expenses = await Expense.findAll({
      where: {
        deptId,
      },
      include: [
        {
          model: WorkFlowMain,
          as: "workflow",
          required: true,
          attributes: [], // don't fetch workflow columns, only use for filtering
          include: [
            {
              model: WorkFlowChild,
              as: "WorkFlowChild",
              required: true,
              attributes: [], // don't fetch child workflow columns
              where: {
                roleId,
                stepOrder: {
                  [Op.eq]: literal("Expense.stepOrder + 1"),
                },
              },
            },
          ],
        },
        {
          model: ExpenseChild, // replace this with the actual child model associated with Expense
          as: "expenseChild", // replace with your alias
          required: false, // optional, include child data if exists
        },
      ],
    });

    res.json({
      items: expenses,
    });
  } catch (error) {
    console.error("Error loading expenses", error);
    res.status(500).json({
      message: "Error loading expenses",
      error,
    });
  }
};
