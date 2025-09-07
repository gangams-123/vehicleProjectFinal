import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db.js";

interface AddressAttributes {
  id: number;
  entityType: "vendor" | "customer" | "official" | "bankaccount"|"branch";
  addressType:"permanent"|"present"|"office";
  entityId: number;
  street: string;
  city: string;
  country:string;
  state: string;
  postalCode: string;
}

interface AddressOptionalAttributes extends Optional<AddressAttributes, "id"> {}

class Address extends Model<AddressAttributes, AddressOptionalAttributes>
  implements AddressAttributes
{
  declare id: number;
  declare country:string;
  declare entityType: "vendor" | "customer" | "official" | "bankaccount";
  declare entityId: number;
  declare street: string;
  declare city: string;
  declare state: string;
  declare postalCode: string;
declare  addressType:"permanent"|"present"|"office";
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Address.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    entityType: {
      type: DataTypes.ENUM("vendor", "customer", "official", "bankaccount","branch"),
      allowNull: false,
    },
      addressType: {
      type: DataTypes.ENUM("permanent","present","office"),
      allowNull: false,
    },
    entityId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    street: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    postalCode: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
     country: {
      type: DataTypes.STRING(20),
      allowNull: false,
    }
  },
  {
    sequelize,
    tableName: "address",
    timestamps: true,
    indexes: [
      {
        name: "entity_index",
        unique: false,
        fields: ["entityId", "entityType"],
      },
    ],
  }
);

export default Address;
