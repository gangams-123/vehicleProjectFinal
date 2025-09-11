import { Routes } from '@angular/router';
import { Userlogin } from './userlogin/userlogin';
import { Branches } from './branches/branches';
import { Landing } from './landing/landing';
import { MainPage } from './main-page/main-page';
import { Vendors } from './vendors/vendors';
import { Make } from './make/make';
import { BankAccount } from './bank-account/bank-account';
import { Models } from './models/models';
import { Modules } from './modules/modules';
import { Roles } from './roles/roles';
import { Workflow } from './workflow/workflow';
import { Department } from './department/department';
import { Designation } from './designation/designation';
import { Branch } from './branch/branch';
import { Officials } from './officials/officials';
import { ExpenseTracker } from './expense-tracker/expense-tracker';
export const routes: Routes = [
  { path: '', component: Userlogin, pathMatch: 'full' },
  { path: 'login', component: Userlogin },
  { path: 'branches', component: Branches },
  {
    path: '',
    component: Landing,
    children: [
      { path: 'mainp', component: MainPage },
      { path: 'vendorsm', component: Vendors },
      { path: 'makem', component: Make },
      { path: 'accountm', component: BankAccount },
      { path: 'modelsm', component: Models },
      { path: 'modulem', component: Modules },
      { path: 'rolem', component: Roles },
      { path: 'workflowm', component: Workflow },
      { path: 'departmentm', component: Department },
      { path: 'designationm', component: Designation },
      { path: 'branchm', component: Branch },
      { path: 'officialsm', component: Officials },
      { path: 'expense', component: ExpenseTracker },
    ],
  },
];
