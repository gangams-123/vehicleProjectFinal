import { TestBed } from '@angular/core/testing';

import { WorkflowPermissionStore } from './workflow-permission-store';

describe('WorkflowPermissionStore', () => {
  let service: WorkflowPermissionStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkflowPermissionStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
