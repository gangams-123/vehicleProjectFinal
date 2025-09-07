// models/model.ts
import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db.js";
import Department from "./department.model.js";

interface DesignationAttributes {
  id: number;
  designationName: string;
  departmentId: number; // Foreign key referencing Make.id
}

interface DesignationOptionalAttributes extends Optional<DesignationAttributes, "id"> {}

class Designation extends Model<DesignationAttributes, DesignationOptionalAttributes>
  implements DesignationAttributes {
  public id!: number;
  public  designationName!: string;
  public departmentId!: number;
}

Designation.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
      designationName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    departmentId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Department, // reference to Make table
        key: "id",   // reference Make.id (makeId)
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  },
  {
    sequelize,
    tableName: "designation",
  }
);

  export default Designation;
