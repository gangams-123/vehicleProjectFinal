import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db.js";

interface OfficialAttributes {
  id: number;
  fName:string;
  mName:string;
  lName:number;
  email:string;
  gender:string;
  dob:Date;
  guardianName:string;
  guardianNum:string;
  relationship:string;
  mobile:string;
  joiningDate:Date;
  basicsal:string;
  pf:boolean;
  esi:boolean;
  pfno:string;
  esino:string;
  departmentId:number;
  dsignationId:number;
  branchId:number;
  password:string;
}

interface OfficialOptionalAttributes extends Optional<OfficialAttributes, "id"> {}

class Official extends Model<OfficialAttributes, OfficialOptionalAttributes>
  implements OfficialAttributes
{
  declare id: number;
  declare companyName:string;
  declare website:string;
  declare accountNo:number;
  declare ifscCode:string;
  declare contactName:string;
  declare gstNo:string;
  declare contactEmail:string;
  declare mobileNo:number;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Vendor.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
   
    mobileNo: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    companyName:  {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    website: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    accountNo:  {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    ifscCode:  {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    contactName:  {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    gstNo:  {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    contactEmail:  {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "official",
    timestamps: true,
  }
);

export default Official;
