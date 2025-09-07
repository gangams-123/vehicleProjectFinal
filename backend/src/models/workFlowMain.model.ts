import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db.js";

interface WorkFlowMainAttributes {
  id: number;
  noofWorkFlow:number;
  module:string;
  status:string;
}

interface WorkFlowMainptionalAttributes extends Optional<WorkFlowMainAttributes, "id"> {}

class WorkFlowMain extends Model<WorkFlowMainAttributes, WorkFlowMainptionalAttributes>
  implements WorkFlowMainAttributes
{
    declare  id: number;
    declare noofWorkFlow:number;
    declare module:string;
    declare status:string;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

WorkFlowMain.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
   
    noofWorkFlow: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    module:  {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    status:{
        type: DataTypes.STRING(20),
      allowNull: false,
    },
   
  },
  {
    sequelize,
    tableName: "workflowmain",
    timestamps: true,
  }
);

export default WorkFlowMain;
