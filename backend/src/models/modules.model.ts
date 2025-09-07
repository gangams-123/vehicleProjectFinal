import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db.js";
//required for typescript for compilation
interface ModuleAttributes {
  id: number;
  moduleName: string;
 craetedBy:string;
 updatedBy:string;
}
interface ModuleCreationAttributes extends Optional<ModuleAttributes, "id"> {}
//needed by squqlise to create table
class Module extends Model<ModuleAttributes, ModuleCreationAttributes>
  implements ModuleAttributes {
  declare id: number;
   declare  moduleName: string;
declare craetedBy:string;
declare  updatedBy:string;

   // Timestamps
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}  
  
  Module.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        moduleName: {
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
        tableName: "module",
  }  
  ); 

  export default Module;