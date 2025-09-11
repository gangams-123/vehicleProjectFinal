// models/model.ts
import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db.js";
import Expense from "./expense.model.js";
import Official from "./official.model.js";

interface ExpenseChildAttributes {
  id: number;
  status: string;
  officialId: number;
  expenseId: number;
  remarks: string;
}

interface ExpenseChildOptionalAttributes
  extends Optional<ExpenseChildAttributes, "id"> {}

class ExpenseChild
  extends Model<ExpenseChildAttributes, ExpenseChildOptionalAttributes>
  implements ExpenseChildAttributes
{
  declare id: number;
  declare status: string;
  declare expenseId: number;
  declare officialId: number;
  declare remarks: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

ExpenseChild.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expenseId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Expense, // reference to Make table
        key: "id", // reference Make.id (makeId)
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    officialId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Official, // reference to Make table
        key: "id", // reference Make.id (makeId)
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    remarks: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "expensechild",
  }
);

export default ExpenseChild;
