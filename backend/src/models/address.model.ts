import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db.js";

interface AddressAttributes {
  id: number;
  entityType: "vendor" | "customer" | "official" | "bankaccount";
  entityId: number;
  street: string;
  city: string;
  state: string;
  postalCode: string;
}

interface AddressOptionalAttributes extends Optional<AddressAttributes, "id"> {}

class Address extends Model<AddressAttributes, AddressOptionalAttributes>
  implements AddressAttributes
{
  declare id: number;
  declare entityType: "vendor" | "customer" | "official" | "bankaccount";
  declare entityId: number;
  declare street: string;
  declare city: string;
  declare state: string;
  declare postalCode: string;

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
      type: DataTypes.ENUM("vendor", "customer", "official", "bankaccount"),
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
