import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db.js";

interface BranchMasterAttributes {
  id: number;
  branchName: string;
  emailId:String;
  url:string;
  mobileNum:number;
  phoneNum:number;
  officeType:string;
  establishedDate:Date;
}
interface BranchMasterOptionalAttributes extends Optional<BranchMasterAttributes, "id"> {}

class BranchMaster
  extends Model<BranchMasterAttributes, BranchMasterOptionalAttributes>
  implements BranchMasterAttributes
{
  declare id: number;
  declare branchName: string;
  declare emailId:String;
  declare url:string;
  declare mobileNum:number;
  declare phoneNum:number;
  declare officeType:string;
  declare establishedDate:Date;
   declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
} 
BranchMaster.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    branchName: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    phoneNum: {
      type: DataTypes.STRING(30), 
      allowNull: false,
    },
    mobileNum: {
      type:DataTypes.STRING(30), 
      allowNull: false,
    },
    emailId: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING(30), // better string, account numbers can be large
      allowNull: false,
    },
    officeType: {
     type: DataTypes.ENUM("mainBranch","subBranch"), // better string, account numbers can be large
      allowNull: false,
    },
    establishedDate: {
      type:DataTypes.DATE,
      allowNull:false,
    }
  },
  {
    sequelize,
    tableName: "branchmaster",
    timestamps: true,
  }
);

export default BranchMaster;