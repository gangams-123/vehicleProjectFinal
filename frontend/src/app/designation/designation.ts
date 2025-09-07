import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MakeService } from '../make/make-service';
import { DesignationService } from './designation-service';
import { ReactiveFormsModule } from '@angular/forms';
import { DepartmentService } from '../department/department-service';

interface designation {
  designationName: string;
  departmentId:string;
  isEditing?: boolean;
  isNew?: boolean;
  id:string;
}
@Component({
  selector: 'app-designation',
    imports: [
    CommonModule,
    FormsModule,          // <-- required for ngModel
    PaginatorModule,
    TableModule,
    ButtonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  templateUrl: './designation.html',
  styleUrl: './designation.css'
})
export class Designation {
  constructor(private departmentService:DepartmentService,private cdr: ChangeDetectorRef,private designationService:DesignationService){}
    loading=false;
    totalRecords: number = 0;
    first: number = 0;
    rows: number = 10;
   successMessage='';
   errorMessage='';
   designations:designation[]=[];
  departments: any=[];
  ngOnInit() {
    this.loadDesignations(this.first,this.rows);    
  } 
  loadDesignations(first: number, rows: number) {
  this.loading = true;
  this.designationService.getDesignations(first, rows).subscribe({
    next: (data) => {
      // Defer update to avoid NG0100
      Promise.resolve().then(() => {
        this.designations = data.items.map((item: any) => ({ ...item, isEditing: false }));
        this.totalRecords = data.total;
        this.loading = false;
        this.cdr.detectChanges(); // extra safety
      });
    },
    error: (err) => {
      console.error('Error loading makes:', err);
      this.errorMessage=err.message;
      this.loading = false;
    }
  });
}
onPageChange(event: any) { 
    this.first = event.first;
   this.loading=false;
    this.rows = event.rows;
    this.loadDesignations(this.first, this.rows);
   
  } 
  addRow() {
       this.departmentService.getAllDepartments().subscribe({
      next:res=>{this.departments=res.items;
        this.cdr.detectChanges
      },
      error: (err) =>{ console.error('Error deleting department:', err);this.errorMessage=err.message;  }
  });
   this.designations =  [{ designationName: '',departmentId:'', isNew: true, isEditing: true,id:'' }, ...this.designations];
  }

  editRow(row: designation) {
    row.isEditing = true;
     this.departmentService.getAllDepartments().subscribe({
    next: (res) => {
      this.departments = res.items;
      row.isEditing = true;
      this.cdr.detectChanges(); // ensure UI refresh
    },
    error: (err) => {
      console.error('Error loading departments:', err);
      this.errorMessage = err.message;
    }
  });
 
  }
  deleteRow(id: number,index:number) {

    this.designationService.deleteDesignation(id).subscribe({
      next:reponse=>{
          this.successMessage=reponse.message;
           this.designations.splice(index, 1);
           this.designations = [...this.designations];
          
           this.cdr.detectChanges();
      },
      error: (err) =>{ console.error('Error deleting designation:', err);this.errorMessage=err.message;  }
    });
   
  }
saveRow(row: designation, index: number) {
  console.log(row);
  const serviceCall = row.isNew
    ? this.designationService.createDesignation(row)
    : this.designationService.updateDesignation(row);
  serviceCall.subscribe({
    next: (response) => {
      row.isNew = false;
      row.isEditing = false;
      row.id = response.data.id;
        this.successMessage=response.message;
      // Defer table reload to avoid NG0100
      Promise.resolve().then(() => {
        this.loadDesignations(this.first / this.rows, this.rows);
      });
    },
    error: (err) =>{ console.error('Error saving designation:', err);this.errorMessage=err.message;}
  });
}


 cancelEdit(row:designation, index: number) {
    if (row.isNew) 
      this.designations.splice(index, 1); // remove new row
    else 
      row.isEditing = false; // revert to view mode
  }
}