import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db.js";
//required for typescript for compilation
interface MakeAttributes {
  id: number;
  makeName: string;
 craetedBy:string;
 updatedBy:string;
}
interface MakeCreationAttributes extends Optional<MakeAttributes, "id"> {}
//needed by squqlise to create table
class Make extends Model<MakeAttributes, MakeCreationAttributes>
  implements MakeAttributes {
  declare id: number;
   declare  makeName: string;
declare craetedBy:string;
declare  updatedBy:string;

   // Timestamps
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}  
  
  Make.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        makeName: {
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
        tableName: "make",
  }  
  ); 

  export default Make;