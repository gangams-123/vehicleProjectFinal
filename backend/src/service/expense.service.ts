// src/service/workflow.service.ts
import { Repository, DataSource } from "typeorm";
import { Expense } from "../entity/expense.js";
import { ExpenseChild } from "../entity/expenseChild.js";
import { WorkFlowChild } from "../entity/WorkFlowChild.js";
import { ENTITY_TYPE } from "../entity/address.js";
import { FileService } from "../service/file.service.js";
import { Official } from "../entity/official.js";

export class ExpenseService {
  private expenseRepo: Repository<Expense>;
  private fileService: FileService;
  private dataSource: DataSource;

  constructor(dataSource: DataSource, fileService: FileService) {
    this.dataSource = dataSource;
    this.expenseRepo = dataSource.getRepository(Expense);
    this.fileService = fileService;
    // this.childRepo = dataSource.getRepository(ExpenseChild);
  }

  async createExpense(
    expenseData: Partial<Expense>,
    files: Express.Multer.File[]
  ): Promise<Expense> {
    const queryRunner = this.expenseRepo.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const manager = queryRunner.manager;
      // Step 2: Destructure and create main Expense
      const { expenseChildren, ...mainData } = expenseData;
      const newExpense = manager.create(Expense, mainData);
      const savedExpense = await manager.save(Expense, newExpense);

      // Step 3: Create child entries and set relations
      if (Array.isArray(expenseChildren) && expenseChildren.length > 0) {
        const childEntities = expenseChildren.map((child: any) => {
          return manager.create(ExpenseChild, {
            status: child.status,
            remarks: child.remarks,
            expense: savedExpense,
            official: { id: child.officialId },
          });
        });

        await manager.save(ExpenseChild, childEntities);
      }

      // Step 4: Handle file uploads (if any)
      if (files && files.length > 0) {
        const fileInputs = files.map((file) => ({
          fileName: file.originalname,
          size: file.size,
          content: file.buffer,
          fileType: file.mimetype,
        }));

        await this.fileService.createFile(
          ENTITY_TYPE.EXPENSE,
          savedExpense.id,
          manager,
          fileInputs
        );
      }

      await queryRunner.commitTransaction();
      return savedExpense;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error("Transaction failed:", error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  getExpensesForApproval = async (
    roleId: string,
    deptId: string
  ): Promise<{
    items: Expense[];
  }> => {
    const expenses = await this.expenseRepo
      .createQueryBuilder("expense")
      .innerJoin("expense.workflow", "main")
      .innerJoin(
        WorkFlowChild,
        "wfChild",
        "wfChild.workFlowMainId = main.id AND wfChild.stepOrder = expense.stepOrder + 1 AND wfChild.roleId = :roleId",
        { roleId }
      )
      .leftJoinAndSelect("expense.expenseChildren", "child")
      .where("expense.deptId = :deptId", { deptId })
      .getMany();
    return { items: expenses };
  };
  async updateExpenseAndAddChild(
    expenseData: Partial<Expense>,
    files: Express.Multer.File[]
  ): Promise<Expense> {
    const queryRunner = this.expenseRepo.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const manager = queryRunner.manager;
      // Step 1: Update the main Expense record
      const { expenseChildren, ...mainData } = expenseData;
      if (!mainData.id) {
        throw new Error("Expense ID is required for update.");
      }

      const updatedExpense = await manager.save(Expense, {
        ...mainData, // should include `status`, `stepOrder`, etc.
      });
      if (expenseChildren && Array.isArray(expenseChildren)) {
        const newChildren = expenseChildren.map((child: any) =>
          manager.create(ExpenseChild, {
            status: child.status,
            remarks: child.remarks,
            expense: { id: updatedExpense.id } as Partial<Expense>,

            official: { id: child.officialId } as Partial<Official>,
          })
        );

        await manager.save(ExpenseChild, newChildren);
        if (files && files.length > 0) {
          const fileInputs = files.map((file) => ({
            fileName: file.originalname,
            size: file.size,
            content: file.buffer,
            fileType: file.mimetype,
          }));

          await this.fileService.createFile(
            ENTITY_TYPE.EXPENSE,
            updatedExpense.id,
            manager,
            fileInputs
          );
        }
      }
      // Step 4: Commit the transaction
      await queryRunner.commitTransaction();
      return updatedExpense;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error("Transaction failed:", error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
