import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WorkflowPermissionStore {
  private _permissions = new BehaviorSubject<any>({});
  //permissions$ = this._permissions.asObservable();

  setPermissions(newPermissions: any) {
    this._permissions.next(newPermissions);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('permissions', JSON.stringify(newPermissions));
    }
  }

  getPermissions(): any {
    if (!Object.keys(this._permissions.value).length) {
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem('permissions');
        if (stored) {
          this._permissions.next(JSON.parse(stored));
        }
      }
    }
    return this._permissions.value;
  }

  clear() {}
}
