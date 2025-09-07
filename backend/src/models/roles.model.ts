import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db.js";
//required for typescript for compilation
interface RolesAttributes {
  id: number;
  roleName: string;
 craetedBy:string;
 updatedBy:string;
}
interface RolesCreationAttributes extends Optional<RolesAttributes, "id"> {}
//needed by squqlise to create table
class Roles extends Model<RolesAttributes, RolesCreationAttributes>
  implements RolesAttributes {
  declare id: number;
   declare  roleName: string;
declare craetedBy:string;
declare  updatedBy:string;

   // Timestamps
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}  
  
  Roles.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        roleName: {
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
        tableName: "roles",
  }  
  ); 

  export default Roles;