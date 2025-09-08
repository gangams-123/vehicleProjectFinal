import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db.js";
import Department from "./department.model.js";
import Designation from "./designation.model.js";
import BranchMaster from "./branchMaster.model.js";
import Roles from "./roles.model.js";

interface OfficialAttributes {
  id: number;
  fName: string;
  mName: string;
  lName: number;
  email: string;
  gender: string;
  dob: Date;
  guardianName: string;
  guardianNum: string;
  relationship: string;
  mobile: string;
  joiningDate: Date;
  basicsal: string;
  pf: boolean;
  esi: boolean;
  pfno: string;
  esino: string;
  departmentId: number;
  designationId: number;
  branchId: number;
  password: string;
  roleId: string;
}

interface OfficialOptionalAttributes
  extends Optional<OfficialAttributes, "id"> {}

class Official
  extends Model<OfficialAttributes, OfficialOptionalAttributes>
  implements OfficialAttributes
{
  declare id: number;
  declare fName: string;
  declare mName: string;
  declare lName: number;
  declare email: string;
  declare gender: string;
  declare dob: Date;
  declare guardianName: string;
  declare guardianNum: string;
  declare relationship: string;
  declare mobile: string;
  declare joiningDate: Date;
  declare basicsal: string;
  declare pf: boolean;
  declare esi: boolean;
  declare pfno: string;
  declare esino: string;
  declare departmentId: number;
  declare designationId: number;
  declare branchId: number;
  declare password: string;
  declare roleId: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Official.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },

    fName: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    mName: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    lName: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    gender: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    dob: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    guardianName: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    guardianNum: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    relationship: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    mobile: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    joiningDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    basicsal: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    pf: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    esi: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    pfno: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    esino: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    departmentId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Department, // reference to Make table
        key: "id", // reference Make.id (makeId)
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    designationId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Designation, // reference to Make table
        key: "id", // reference Make.id (makeId)
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    branchId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: BranchMaster, // reference to Make table
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    roleId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Roles, // reference to Make table
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  },
  {
    sequelize,
    tableName: "official",
    timestamps: true,
  }
);

export default Official;
