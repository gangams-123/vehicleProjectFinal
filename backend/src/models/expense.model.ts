import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db.js";
import Department from "./department.model.js";
import WorkFlowMain from "./workFlowMain.model.js";
//required for typescript for compilation
interface ExpenseAttributes {
  id: number;
  amount: number;
  deptId: number;
  status: string;
  stepOrder: number;
  workflowId: number;
}
interface ExpenseCreationAttributes extends Optional<ExpenseAttributes, "id"> {}
//needed by sequelise to create table
class Expense
  extends Model<ExpenseAttributes, ExpenseCreationAttributes>
  implements ExpenseAttributes
{
  declare id: number;
  declare amount: number;
  declare deptId: number;
  declare status: string;
  declare stepOrder: number;
  declare workflowId: number;
  // Timestamps
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Expense.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },

    amount: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    deptId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Department, // reference to Make table
        key: "id", // reference Make.id (makeId)
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    stepOrder: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    workflowId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: WorkFlowMain, // reference to Make table
        key: "id", // reference Make.id (makeId)
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  },
  {
    sequelize,
    tableName: "expense",
  }
);

export default Expense;
