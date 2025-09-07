import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db.js";

interface VendorAttributes {
  id: number;
  companyName:string;
  website:string;
  accountNo:number;
  ifscCode:string;
  contactName:string;
  gstNo:string;
  contactEmail:string;
  mobileNo:number;  
}

interface VendorOptionalAttributes extends Optional<VendorAttributes, "id"> {}

class Vendor extends Model<VendorAttributes, VendorOptionalAttributes>
  implements VendorAttributes
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
