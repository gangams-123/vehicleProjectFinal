import sequelize from "../config/db.js";

import Vendor from "./vendor.model.js";
import Address from "./address.model.js";
import BankAccount from "./bankAccount.model.js";
import File from "./file.model.js";
import Models from "./models.model.js";
import Make from "./make.model.js";
import WorkFlowChild from "./workFlowChild.model.js";
import WorkFlowMain from "./workFlowMain.model.js";
import Roles from "./roles.model.js";

// -------------------- Associations --------------------

// Vendor ↔ Address
Vendor.hasMany(Address, {
  foreignKey: "entityId",
  constraints: false,
  scope: { entityType: "vendor" },
});

Address.belongsTo(Vendor, {
  foreignKey: "entityId",
  constraints: false,
});

// BankAccount ↔ File
BankAccount.hasMany(File, {
  foreignKey: "entityId",
  constraints: false,
  scope: { entityType: "bankaccount" },
    onDelete: 'CASCADE'
});

File.belongsTo(BankAccount, {
  foreignKey: "entityId",
  constraints: false,
});

WorkFlowMain.hasMany(WorkFlowChild, {
  foreignKey: "mainId",
  constraints: false,
});

WorkFlowChild.belongsTo(WorkFlowMain, {
  foreignKey: "mainId",
  constraints: false,
});
WorkFlowChild.belongsTo(Roles, {
  foreignKey: 'roleId',
});
// Associations
Make.hasMany(Models, { foreignKey: "makeId" });
Models.belongsTo(Make, { foreignKey: "makeId" });


export { sequelize, Vendor, Address, BankAccount, File ,Make,Models,WorkFlowChild,WorkFlowMain};
