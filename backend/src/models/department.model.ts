import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db.js";
//required for typescript for compilation
interface DepartmentAttributes {
  id: number;
  departmentName: string;
 craetedBy:string;
 updatedBy:string;
}
interface DepartmentCreationAttributes extends Optional<DepartmentAttributes, "id"> {}
//needed by squqlise to create table
class Department extends Model<DepartmentAttributes, DepartmentCreationAttributes>
  implements DepartmentAttributes {
  declare id: number;
   declare  departmentName: string;
declare craetedBy:string;
declare  updatedBy:string;

   // Timestamps
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}  
  
  Department.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        departmentName: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
         craetedBy: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        updatedBy: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
    },   
      {
        sequelize,
        tableName: "Department",
  }  
  ); 

  export default Department;