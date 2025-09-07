import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db.js";

interface BankAccountAttributes {
  id: number;
  totalAmount: number;
  ifscCode: string;
  bankName: string;
  address: string;
  accountNo: string;
}

interface BankAccountOptionalAttributes extends Optional<BankAccountAttributes, "id"> {}

class BankAccount
  extends Model<BankAccountAttributes, BankAccountOptionalAttributes>
  implements BankAccountAttributes
{
  declare id: number;
  declare totalAmount: number;
  declare ifscCode: string;
  declare bankName: string;
  declare address: string;
  declare accountNo: string;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

BankAccount.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    ifscCode: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    bankName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    totalAmount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    accountNo: {
      type: DataTypes.STRING(30), // better string, account numbers can be large
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "bankaccount",
    timestamps: true,
  }
);

export default BankAccount;
