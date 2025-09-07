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
import Department from "./department.model.js";
import Designation from "./designation.model.js";
import BranchMaster from "./branchMaster.model.js";
import Official from "./official.model.js";
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
BranchMaster.hasMany(Address, {
  foreignKey: "entityId",
  constraints: false,
  scope: { entityType: "branchmaster" },
});

BranchMaster.hasMany(File, {
  foreignKey: "entityId",
  constraints: false,
  scope: { entityType: "branchmaster" },
    onDelete: 'CASCADE'
});

BranchMaster.hasMany(File, {
  foreignKey: "entityId",
  constraints: false,
  scope: { entityType: "branchmaster" },
    onDelete: 'CASCADE'
});

// Associations
Models.belongsTo(Make, { foreignKey: "makeId" });
Designation.belongsTo(Department,{foreignKey:"departmentId"});

export {sequelize,Vendor, Address, BankAccount, File ,Make,Models,WorkFlowChild,WorkFlowMain,Designation,Department};
