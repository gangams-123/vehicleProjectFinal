import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DesignationService } from './designation-service';
import { DepartmentService } from '../department/department-service';

interface designation {
  name: string;
  departmentId: string;
  isEditing?: boolean;
  isNew?: boolean;
  id: string;
}
@Component({
  selector: 'app-designation',
  imports: [
    CommonModule,
    FormsModule, // <-- required for ngModel
    PaginatorModule,
    TableModule,
    ButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './designation.html',
  styleUrl: './designation.css',
})
export class Designation {
  constructor(
    private departmentService: DepartmentService,
    private cdr: ChangeDetectorRef,
    private designationService: DesignationService
  ) {}
  loading = false;
  totalRecords: number = 0;
  first: number = 0;
  rows: number = 10;
  successMessage = '';
  errorMessage = '';
  designations: designation[] = [];
  departments: any[] = [];
  ngOnInit() {
    this.loadDesignations(this.first, this.rows);
  }
  loadDesignations(first: number, rows: number) {
    this.loading = true;
    this.designationService.getDesignations(first, rows).subscribe({
      next: (res) => {
        console.log(res);
        Promise.resolve().then(() => {
          this.designations = res.data.map((item: any) => ({
            ...item,
            departmentId: Number(item.departmentId),
            isEditing: false,
          }));
          this.totalRecords = res.data.total;
          this.loading = false;
          this.cdr.detectChanges(); // extra safety
        });
      },
      error: (err) => {
        console.error('Error loading makes:', err);
        this.errorMessage = err.message;
        this.loading = false;
      },
    });
  }
  onPageChange(event: any) {
    this.first = event.first;
    this.loading = false;
    this.rows = event.rows;
    this.loadDesignations(this.first, this.rows);
  }
  addRow() {
    this.departmentService.getAllDepartments().subscribe({
      next: (res) => {
        setTimeout(() => {
          this.departments = res.data;
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        console.error('Error deleting department:', err);
        this.errorMessage = err.message;
      },
    });
    this.designations = [
      { name: '', departmentId: '', isNew: true, isEditing: true, id: '' },
      ...this.designations,
    ];
  }

  editRow(row: designation) {
    row.isEditing = true;
    this.departmentService.getAllDepartments().subscribe({
      next: (res) => {
        setTimeout(() => {
          this.departments = res.data;
          row.isEditing = true;
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        console.error('Error loading departments:', err);
        this.errorMessage = err.message;
      },
    });
  }
  deleteRow(id: number, index: number) {
    this.designationService.deleteDesignation(id).subscribe({
      next: (reponse) => {
        this.successMessage = reponse.message;
        this.designations.splice(index, 1);
        this.designations = [...this.designations];

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error deleting designation:', err);
        this.errorMessage = err.message;
      },
    });
  }
  saveRow(row: designation, index: number) {
    const payload = {
      name: row.name,
      id: row.id,
      department: { id: row.departmentId }, // ✅ Correct structure for TypeORM
    };
    console.log(payload);
    const serviceCall = row.isNew
      ? this.designationService.createDesignation(payload)
      : this.designationService.updateDesignation(row.id, payload);
    serviceCall.subscribe({
      next: (response) => {
        row.isNew = false;
        row.isEditing = false;
        this.successMessage = response.message;
        // Defer table reload to avoid NG0100
        Promise.resolve().then(() => {
          this.loadDesignations(this.first / this.rows, this.rows);
        });
      },
      error: (err) => {
        console.error('Error saving designation:', err);
        this.errorMessage = err.message;
      },
    });
  }

  cancelEdit(row: designation, index: number) {
    if (row.isNew) this.designations.splice(index, 1); // remove new row
    else row.isEditing = false; // revert to view mode
  }
}
