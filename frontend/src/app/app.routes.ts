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
export const routes: Routes = [
    { path: '', component: Userlogin,pathMatch:'full' }, // Default route
    { path: 'login', component: Userlogin},
    {path:'branches',component:Branches},
    {path:'',component:Landing,
        children :
      [
        {path:'mainp',component:MainPage},
        {path:'vendorsm',component:Vendors},
        {path:'makem',component:Make},
        {path:'accountm',component:BankAccount},
        {path:'modelsm',component:Models},
        {path:'modulem',component:Modules},
        {path:'rolem',component:Roles},
        {path:'workflowm',component:Workflow}
    ]},

];
