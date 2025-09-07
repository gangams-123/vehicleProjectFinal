import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db.js";
import Roles from "./roles.model.js";

interface WorkFlowChildAttributes {
  id: number;
  status:string;
  roleId:number;
  mainId:number;
    
}

interface WorkFlowChildoptionalAttributes extends Optional<WorkFlowChildAttributes, "id"> {}

class WorkFlowChild extends Model<WorkFlowChildAttributes, WorkFlowChildoptionalAttributes>
  implements WorkFlowChildAttributes
{
    declare  id: number;
    declare status:string;
    declare roleId:number;
    declare mainId:number;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

WorkFlowChild.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
   
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    
    roleId:  {
     type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Roles, // reference to Make table
        key: "id",   // reference Make.id (makeId)
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    mainId:{
         type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "workflowChild",
    timestamps: true,
  }
);

export default WorkFlowChild;
