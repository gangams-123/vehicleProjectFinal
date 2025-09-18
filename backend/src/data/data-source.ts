import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { Department } from "../entity/department.js";
import { Designation } from "../entity/designation.js";
import { Role } from "../entity/role.js";
import { Branch } from "../entity/branch.js";
import { Address } from "../entity/address.js";
import { Make } from "../entity/make.js";
import { BankAccount } from "../entity/bankAccount.js";
import { File } from "../entity/file.js";
import { WorkFlowMain } from "../entity/workFlowMain.js";
import { WorkFlowChild } from "../entity/WorkFlowChild.js";
import { Model } from "../entity/model.js";
import { Expense } from "../entity/expense.js";
import { ExpenseChild } from "../entity/expenseChild.js";
import { Vendor } from "../entity/vendor.js";
import { Official } from "../entity/official.js";
dotenv.config(); // Load .env variables
export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER, // <-- use DB_USER here
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: ["error", "warn", "schema"],
  dropSchema: false,
  entities: [
    Department,
    Designation,
    Role,
    Branch,
    Address,
    File,
    Make,
    BankAccount,
    WorkFlowMain,
    WorkFlowChild,
    Model,
    Expense,
    ExpenseChild,
    Vendor,
    Official,
  ],
});
