import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MODULES, Status_Expense } from '../constants/constants';
import { WorkflowPermissionService } from '../service/workflow-permission-service';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ExpenseTrackerService } from './expense-tracker-service';
import { ActivatedRoute } from '@angular/router';
//for grid
import { TableModule, TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
@Component({
  selector: 'app-expense-tracker',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCardModule,
    MatProgressSpinnerModule,
    TableModule,
    FormsModule,
  ],
  templateUrl: './expense-tracker.html',
  styleUrl: './expense-tracker.css',
})
export class ExpenseTracker {
  module = MODULES[0];
  view = true;
  status = Status_Expense;
  isLoading = true;
  expenseView = false;
  successMessage = '';
  errorMessage = '';
  expenseList = [];
  expenseForm = new FormGroup({
    amount: new FormControl(''),
    details: new FormControl(''),
    files: new FormArray<FormGroup>([]),
  });
  constructor(
    public permissionService: WorkflowPermissionService,
    private expenseTrackerService: ExpenseTrackerService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
  ) {}
  ngOnInit() {
    this.permissionService.loadPermissions(this.module).subscribe(() => (this.isLoading = false));
    this.route.queryParams.subscribe((params) => {
      if (params['view'] !== undefined) {
        this.view = params['view'] == 'true';
      }
    });
    let roleId = '',
      deptId = '';
    if (typeof window !== 'undefined' && window.localStorage) {
      roleId = localStorage.getItem('roleId') ?? '';
      deptId = localStorage.getItem('deptId') ?? '';
      this.expenseTrackerService.getExpensesForApproval(roleId ?? '', deptId ?? '').subscribe({
        next: (res) => {
          Promise.resolve().then(() => {
            this.expenseList = res.items;
            this.cdr.detectChanges(); // extra safety
          });
        },
      });
    }
  }
  createExpense() {
    this.view = false;
  }
  selectedFiles: File[] = [];
  saving: boolean = false;
  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = Array.from(input.files); // just keep reference
    }
  }
  onSubmit() {
    if (this.saving) return; // prevent double click
    this.saving = true;
    const formData = new FormData();

    // Add normal form fields
    formData.append('status', this.status[0]);
    formData.append('amount', this.expenseForm.get('amount')?.value ?? '');

    formData.append('deptId', localStorage.getItem('deptId') ?? '');
    formData.append('stepOrder', '1');
    const workflowId = this.permissionService.getWorkflowIdByStatus(this.module, this.status[0]);
    formData.append('workflowId', workflowId?.toString() ?? '');
    const workflow = {
      status: this.status[0],
      remarks: this.expenseForm.get('details')?.value ?? '',
      officialId: localStorage.getItem('officialId') || '0',
    };
    formData.append('workflow', JSON.stringify(workflow));
    this.selectedFiles.forEach((file) => {
      formData.append('files', file);
    });
    console.log(formData);
    this.expenseTrackerService.createExpense(formData).subscribe({
      next: (res) => {
        this.successMessage = res.message;
        this.saving = false;
        this.view = true;
        this.cdr.markForCheck();
      },
      error: (err) => {},
    });
  }
  expenseViewData: any = null;
  openExpense(expense: any) {
    this.expenseView = true;
    this.expenseViewData = {
      ...expense,
      currentRemarks: '', // to avoid undefined binding
    };
  }
  approve(expenseViewData: any) {
    const officialId = localStorage.getItem('officialId') ?? '0';
    const newStepOrder = Number(expenseViewData.stepOrder) + 1;
    const newStatus = this.permissionService.getStatusByStepOrder(newStepOrder);
    console.log('newstatus  ', newStatus);
    // Build the new child remark object
    const newRemark = {
      remarks: expenseViewData.currentRemarks ?? '',
      officialId: parseInt(officialId),
      status: newStatus,
      expenseId: expenseViewData.id,
    };
    const { currentRemarks, ...cleanExpense } = expenseViewData;
    const expenseToSubmit = {
      ...cleanExpense,
      expenseChild: [newRemark],
    };
    expenseToSubmit.status = newStatus;
    expenseToSubmit.stepOrder = newStepOrder;

    // Push the new remark

    // Now send this full object to backend
    console.log([expenseToSubmit]); // Wrap in array if backend expects an array
    this.expenseTrackerService;

    // Example: Send to service
  }

  reject(expensiveViewData: any) {}
}
