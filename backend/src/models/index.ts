// models/index.js
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
import Expense from "./expense.model.js";
import ExpenseChild from "./expense.child.model.js";

// ----------------------------
// Vendor ↔ Address
// ----------------------------
Vendor.hasMany(Address, {
  foreignKey: "entityId",
  constraints: false,
  scope: { entityType: "vendor" },
});

Address.belongsTo(Vendor, {
  foreignKey: "entityId",
  constraints: false,
});

// ----------------------------
// BankAccount ↔ File
// ----------------------------
BankAccount.hasMany(File, {
  foreignKey: "entityId",
  constraints: false,
  scope: { entityType: "bankaccount" },
  onDelete: "CASCADE",
});

File.belongsTo(BankAccount, {
  foreignKey: "entityId",
  constraints: false,
});

// ----------------------------
// WorkFlowMain ↔ WorkFlowChild ↔ Roles
// ----------------------------
WorkFlowMain.hasMany(WorkFlowChild, {
  as: "WorkFlowChild",
  foreignKey: "mainId",
  constraints: false,
});

WorkFlowChild.belongsTo(WorkFlowMain, {
  foreignKey: "mainId",
  constraints: false,
});

WorkFlowChild.belongsTo(Roles, {
  foreignKey: "roleId",
});

// ----------------------------
// BranchMaster ↔ Address ↔ File
// ----------------------------
BranchMaster.hasMany(Address, {
  foreignKey: "entityId",
  constraints: false,
  scope: { entityType: "branchmaster" },
});

BranchMaster.hasMany(File, {
  foreignKey: "entityId",
  constraints: false,
  scope: { entityType: "branchmaster" },
  onDelete: "CASCADE",
});

// ----------------------------
// Official ↔ Address ↔ File <>  expense child
// -----------------------------

Expense.hasMany(ExpenseChild, { as: "expenseChild", foreignKey: "expenseId" });
ExpenseChild.belongsTo(Expense, { foreignKey: "expenseId" });

Official.hasMany(Address, {
  foreignKey: "entityId",
  constraints: false,
  scope: { entityType: "official" },
});

Official.hasMany(File, {
  foreignKey: "entityId",
  constraints: false,
  scope: { entityType: "official" },
});

// ----------------------------
// Official ↔ Roles ↔ Department
// ----------------------------
Official.belongsTo(Roles, {
  foreignKey: "roleId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Roles.hasMany(Official, { foreignKey: "roleId" });

Official.belongsTo(Department, {
  foreignKey: "departmentId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Department.hasMany(Official, { foreignKey: "departmentId" });

// ----------------------------
// Models ↔ Make
// ----------------------------
Models.belongsTo(Make, { foreignKey: "makeId" });

// ----------------------------
// Designation ↔ Department
// ----------------------------
Designation.belongsTo(Department, { foreignKey: "departmentId" });

//------------------------------
//expense<-> file <-->workflowChild

Expense.hasMany(File, {
  foreignKey: "entityId",
  constraints: false,
  scope: { entityType: "expense" },
});

Expense.belongsTo(WorkFlowMain, {
  foreignKey: "workflowId",
  as: "workflow",
  constraints: false,
});

// ----------------------------
// Cascade Delete Hooks
// ----------------------------

// Generic helper to delete both Address and File
const deleteRelatedEntities = async (instance: any, entityType: any) => {
  await Address.destroy({
    where: {
      entityId: instance.id,
      entityType: entityType,
    },
  });

  await File.destroy({
    where: {
      entityId: instance.id,
      entityType: entityType,
    },
  });
};

// Vendor cleanup
Vendor.beforeDestroy(async (vendor) => {
  await deleteRelatedEntities(vendor, "vendor");
});

// Official cleanup
Official.beforeDestroy(async (official) => {
  await deleteRelatedEntities(official, "official");
});

// BranchMaster cleanup
BranchMaster.beforeDestroy(async (branch) => {
  await deleteRelatedEntities(branch, "branchmaster");
});

//expense cleanup
Expense.beforeDestroy(async (expense) => {
  await deleteRelatedEntities(expense, "expense");
});

// ----------------------------
// Export Everything
// ----------------------------
export {
  sequelize,
  Vendor,
  Address,
  BankAccount,
  File,
  Make,
  Models,
  WorkFlowChild,
  WorkFlowMain,
  Roles,
  Department,
  Designation,
  BranchMaster,
  Official,
  Expense,
};
