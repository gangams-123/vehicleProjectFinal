import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MODULES, Status_Expense } from '../constants/constants';
import { WorkflowPermissionService } from '../service/workflow-permission-service';
import { rejectStatus, rejectStepOrder } from '../constants/constants';
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
import { TableModule } from 'primeng/table';
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
  rejectStatus = rejectStatus;
  expenseForm = new FormGroup({
    amount: new FormControl(''),
    details: new FormControl(''),
    files: new FormArray<FormGroup>([]),
  });
  constructor(
    public permissionService: WorkflowPermissionService,
    private expenseTrackerService: ExpenseTrackerService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {}
  ngOnInit() {
    this.permissionService.loadPermissions(this.module).subscribe(() => (this.isLoading = false));
    this.route.queryParams.subscribe((params) => {
      if (params['view'] !== undefined) {
        this.view = params['view'] == 'true';
      }
      this.loadExpensesForApproval();
    });
  }
  loadExpensesForApproval() {
    let roleId = '',
      deptId = '';
    if (typeof window !== 'undefined' && window.localStorage) {
      roleId = localStorage.getItem('roleId') ?? '';
      deptId = localStorage.getItem('deptId') ?? '';
      this.expenseTrackerService.getExpensesForApproval(roleId ?? '', deptId ?? '').subscribe({
        next: (res) => {
          console.log(res);
          Promise.resolve().then(() => {
            this.expenseList = res.data;
            this.cdr.detectChanges();
          });
        },
      });
    }
  }
  createExpense() {
    this.view = false;
    this.expenseForm.reset();
    this.selectedFiles = [];
    this.successMessage = '';
    this.errorMessage = '';
  }
  selectedFiles: File[] = [];
  saving: boolean = false;
  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = Array.from(input.files);
    }
  }
  onSubmit() {
    if (this.saving) return;
    this.saving = true;
    const formData = new FormData();
    const workflowId = this.permissionService.getWorkflowIdByStatus(this.module, this.status[0]);
    const workflow = [
      {
        status: this.status[0],
        remarks: this.expenseForm.get('details')?.value ?? '',
        officialId: localStorage.getItem('officialId') || '0',
      },
    ];
    const expenseData: any = {
      status: this.status[0],
      amount: this.expenseForm.get('amount')?.value ?? '',
      workflowId: workflowId?.toString() ?? '',
      deptId: localStorage.getItem('deptId') ?? '',
      stepOrder: 1,
      expenseChildren: workflow,
    };
    if (this.isResubmitting) {
      expenseData.id = this.expenseViewData.id;
    }
    formData.append('expenseData', JSON.stringify(expenseData));
    this.selectedFiles.forEach((file) => {
      formData.append('files', file);
    });
    console.log('formdata  ', formData);
    const apiCall = this.isResubmitting
      ? this.expenseTrackerService.updateExpense(formData) // PUT
      : this.expenseTrackerService.createExpense(formData); // POST
    apiCall.subscribe({
      next: (res) => {
        this.successMessage = res.message;
        this.saving = false;
        this.view = true;
        this.loadExpensesForApproval();
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
      currentRemarks: '',
    };
  }
  get isResubmitting(): boolean {
    return !!this.expenseViewData?.id && this.expenseViewData?.status === this.rejectStatus;
  }
  approve(expenseViewData: any, statusClicked: string) {
    const officialId = localStorage.getItem('officialId') ?? '0';
    const newStepOrder = Number(expenseViewData.stepOrder) + 1;
    const newStatus = this.permissionService.getStatusByStepOrder(newStepOrder);
    const formData = new FormData();
    const newRemark: any = {
      remarks: expenseViewData.currentRemarks ?? '',
      officialId: parseInt(officialId),
      expenseId: expenseViewData.id,
    };
    if (statusClicked == 'approve') newRemark.status;
    else status: rejectStatus;
    const expenseData: any = {
      amount: expenseViewData.amount,
      workflowId: expenseViewData.workflowId,
      deptId: localStorage.getItem('deptId') ?? '',
      expenseChildren: [newRemark],
    };
    if (statusClicked == 'approve') {
      expenseData.status = newStatus;
      expenseData.stepOrder = newStepOrder;
    } else {
      expenseData.status = rejectStatus;
      expenseData.stepOrder = rejectStepOrder;
    }
    formData.append('expenseData', JSON.stringify(expenseData));
    this.expenseTrackerService.updateExpense(formData).subscribe({
      next: (res) => {
        this.loadExpensesForApproval();
      },
      error: (error) => {
        console.log('error in updating');
      },
    });
  }
}
