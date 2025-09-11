import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db.js";

interface FileAttributes {
  id: number;
  entityType:
    | "vendor"
    | "customer"
    | "official"
    | "bankaccount"
    | "branch"
    | "expense";
  entityId: number;
  fileName: string;
  size: number;
  content: Buffer;
  fileType: String;
}

interface FileOptionalAttributes extends Optional<FileAttributes, "id"> {}

class File
  extends Model<FileAttributes, FileOptionalAttributes>
  implements FileAttributes
{
  declare id: number;
  declare entityType:
    | "vendor"
    | "customer"
    | "official"
    | "bankaccount"
    | "branch";
  declare entityId: number;
  declare fileName: string;
  declare size: number;
  declare content: Buffer;
  declare fileType: String;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

File.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    fileName: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    content: {
      type: DataTypes.BLOB("long"),
      allowNull: false,
    },
    entityType: {
      type: DataTypes.ENUM("vendor", "customer", "official", "bankaccount"),
      allowNull: false,
    },
    entityId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    fileType: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "file",
    timestamps: true,
    indexes: [
      {
        name: "entity_index",
        unique: false,
        fields: ["entityId", "entityType"],
      },
    ],
  }
);

export default File;
