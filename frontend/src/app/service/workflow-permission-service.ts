import { Injectable } from '@angular/core';
import { WorkflowService } from '../workflow/workflow-service';
import { WorkflowPermissionStore } from './workflow-permission-store';
import { workFlowStatus } from '../constants/constants';
import { tap } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class WorkflowPermissionService {
  constructor(
    private workflowService: WorkflowService,
    private workflowPermissionStore: WorkflowPermissionStore
  ) {}
  loadPermissions(module: string) {
    return this.workflowService.getWorkflowByStatusByModule(module, workFlowStatus[0]).pipe(
      tap((res) => {
        const currentPermissions = this.workflowPermissionStore.getPermissions();
        currentPermissions[module] = res.data;
        this.workflowPermissionStore.setPermissions(currentPermissions);
      })
    );
  }

  // Check if the current role can perform a given action
  can(module: string, action: string): boolean {
    const permissions = this.workflowPermissionStore.getPermissions();
    const modulePermissions = permissions[module] || {};
    const roleIds = modulePermissions[action] || [];
    let currentRoleId = '';
    // it runs inly in browser else localstorage is undefined
    if (typeof window !== 'undefined' && window.localStorage) {
      currentRoleId = localStorage.getItem('roleId') ?? '';
    }
    return roleIds.some((roleObj: any) => roleObj.roleId === currentRoleId);
  }
  getWorkflowIdByStatus = (module: string, status: string): number | undefined => {
    const permissions = this.workflowPermissionStore.getPermissions();
    const modulePermissions = permissions[module] || {};
    const ids = modulePermissions[status] || [];

    return ids[0].workflowId;
  };

  hasModulePermission(module: string): boolean {
    const permissions = this.workflowPermissionStore.getPermissions();
    const modulePermissions = permissions[module] || {};

    // Cast Object.values to string[][]
    const actions = Object.values(modulePermissions) as string[][];
    let currentRoleId = '';
    if (typeof window !== 'undefined' && window.localStorage) {
      currentRoleId = localStorage.getItem('roleId') ?? '';
    }
    // Check if current role exists in any action
    return actions.some((roleIds) => roleIds.includes(currentRoleId));
  }
  getStatusByStepOrder(stepOrder: number): string | null {
    const permissions = this.workflowPermissionStore.getPermissions();
    const expensePermissions = permissions?.expenseTracker;
    console.log(expensePermissions);
    for (const [status, steps] of Object.entries(expensePermissions)) {
      if (Array.isArray(steps)) {
        for (const step of steps) {
          if (Number(step.stepOrder) === Number(stepOrder)) {
            return status;
          }
        }
      }
    }
    return null; // Not found
  }
}
