import { Component ,ChangeDetectorRef} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
//for grid
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { RolesService } from './roles-service';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
interface role {
  roleName: string;
  isEditing?: boolean;
  isNew?: boolean;
  id:string;
}
@Component({
  selector: 'app-roles',
  imports: [CommonModule,PaginatorModule,TableModule,ButtonModule,MatInputModule,FormsModule,MatFormFieldModule],
  templateUrl: './roles.html',
  styleUrl: './roles.css'
})

export class Roles {
  constructor(private rolesService:RolesService,private cdr: ChangeDetectorRef){}
  loading=false;
  roles: role[] = []; 
  totalRecords: number = 0;
  first: number = 0;
  rows: number = 10;
 successMessage='';
 errorMessage='';
  ngOnInit() {
    this.loadRoles(this.first,this.rows);    
  } 
loadRoles(first: number, rows: number) {
  this.loading = true;
  this.rolesService.getRoles(first, rows).subscribe({
    next: (data) => {
      // Defer update to avoid NG0100
      Promise.resolve().then(() => {
        this.roles = data.items.map((item: any) => ({ ...item, isEditing: false }));
        this.totalRecords = data.total;
        this.loading = false;
        this.cdr.detectChanges(); // extra safety
      });
    },
    error: (err) => {
      console.error('Error loading roles:', err);
      this.loading = false;
      this.errorMessage=err.message;
    }
  });
}


  onPageChange(event: any) { 
    this.first = event.first;
   this.loading=false;
    this.rows = event.rows;
    this.loadRoles(this.first, this.rows);
   
  } 
  addRow() {
    this.roles =  [{ roleName: '', isNew: true, isEditing: true,id:'' }, ...this.roles];
  }
  editRow(row: role) {
    row.isEditing = true;
  }
  deleteRow(id: number,index:number) {

    this.rolesService.deleteRole(id).subscribe({
      next:reponse=>{
          this.successMessage=reponse.message;
           this.roles.splice(index, 1);
           this.roles = [...this.roles];
          
           this.cdr.detectChanges();
      },
      error: (err) =>{ console.error('Error deleting roles:', err);this.errorMessage=err.message;  }
    });
   
  }
saveRow(row: role, index: number) {
  const serviceCall = row.isNew
    ? this.rolesService.createRole(row)
    : this.rolesService.updateRole(row);
  serviceCall.subscribe({
    next: (response) => {
      row.isNew = false;
      row.isEditing = false;
      row.id = response.data.id;
        this.successMessage=response.message;
      // Defer table reload to avoid NG0100
      Promise.resolve().then(() => {
        this.loadRoles(this.first / this.rows, this.rows);
      });
    },
    error: (err) =>{ console.error('Error saving role:', err);this.errorMessage=err.message;}
  });
}


 cancelEdit(row:role, index: number) {
    if (row.isNew) 
      this.roles.splice(index, 1); // remove new row
    else 
      row.isEditing = false; // revert to view mode
  }
}


