import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
//for grid
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { DepartmentService } from './department-service';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
interface department {
  name: string;
  isEditing?: boolean;
  isNew?: boolean;
  id: string;
}
@Component({
  selector: 'app-department',
  imports: [
    CommonModule,
    PaginatorModule,
    TableModule,
    ButtonModule,
    MatInputModule,
    FormsModule,
    MatFormFieldModule,
  ],
  templateUrl: './department.html',
  styleUrl: './department.css',
})
export class Department {
  loading = false;
  departments: department[] = [];
  totalRecords: number = 0;
  first: number = 0;
  rows: number = 10;
  successMessage = '';
  errorMessage = '';
  constructor(private departmentService: DepartmentService, private cdr: ChangeDetectorRef) {}
  ngOnInit() {
    this.loadDepartments(this.first, this.rows);
  }
  loadDepartments(first: number, rows: number) {
    this.loading = true;
    this.departmentService.getDepartments(first, rows).subscribe({
      next: (res) => {
        // Defer update to avoid NG0100
        Promise.resolve().then(() => {
          this.departments = res.data.map((item: any) => ({ ...item, isEditing: false }));
          this.totalRecords = res.total;
          this.loading = false;
          this.cdr.detectChanges(); // extra safety
        });
      },
      error: (err) => {
        console.error('Error loading departments:', err);
        this.loading = false;
        this.errorMessage = err.message;
      },
    });
  }
  onPageChange(event: any) {
    this.first = event.first;
    this.loading = false;
    this.rows = event.rows;
    this.loadDepartments(this.first, this.rows);
  }
  addRow() {
    this.departments = [{ name: '', isNew: true, isEditing: true, id: '' }, ...this.departments];
  }
  editRow(row: department) {
    row.isEditing = true;
    row.isNew = false;
  }
  deleteRow(id: number, index: number) {
    this.departmentService.deleteDepartment(id).subscribe({
      next: (reponse) => {
        this.successMessage = reponse.message;
        this.departments.splice(index, 1);
        this.departments = [...this.departments];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error deleting departments:', err);
        this.errorMessage = err.message;
      },
    });
  }
  saveRow(row: department, index: number) {
    const { isEditing, isNew, ...cleaned } = row;
    const serviceCall = row.isNew
      ? this.departmentService.createDepartment(cleaned)
      : this.departmentService.updateDepartment(cleaned.id, cleaned);
    serviceCall.subscribe({
      next: (response) => {
        row.isNew = false;
        row.isEditing = false;
        this.successMessage = response.message;
        this.cdr.detectChanges();
        Promise.resolve().then(() => {
          this.loadDepartments(this.first / this.rows, this.rows);
        });
      },
      error: (err) => {
        console.error('Error saving department:', err);
        this.errorMessage = err.message;
      },
    });
  }

  cancelEdit(row: department, index: number) {
    if (row.isNew) this.departments.splice(index, 1);
    else row.isEditing = false;
  }
}
