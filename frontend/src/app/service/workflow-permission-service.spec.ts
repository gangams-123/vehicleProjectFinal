import { TestBed } from '@angular/core/testing';

import { WorkflowPermissionService } from './workflow-permission-service';

describe('WorkflowPermissionService', () => {
  let service: WorkflowPermissionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkflowPermissionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
