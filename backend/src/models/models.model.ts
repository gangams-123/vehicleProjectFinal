// models/model.ts
import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db.js";
import Make from "./make.model.js";

interface ModelAttributes {
  id: number;
  modelName: string;
  makeId: number; // Foreign key referencing Make.id
}

interface ModelOptionalAttributes extends Optional<ModelAttributes, "id"> {}

class Models extends Model<ModelAttributes, ModelOptionalAttributes>
  implements ModelAttributes {
  public id!: number;
  public modelName!: string;
  public makeId!: number;
}

Models.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    modelName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    makeId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Make, // reference to Make table
        key: "id",   // reference Make.id (makeId)
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  },
  {
    sequelize,
    tableName: "models",
  }
);

  export default Models;
