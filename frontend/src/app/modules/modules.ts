//for grid
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { ModulesService } from './modules-service';
import { Component ,ChangeDetectorRef} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
interface module {
  moduleName: string;
  isEditing?: boolean;
  isNew?: boolean;
  id:string;
}
@Component({
  selector: 'app-modules',
  imports: [CommonModule,PaginatorModule,TableModule,ButtonModule,MatInputModule,FormsModule,MatFormFieldModule],
  templateUrl: './modules.html',
  styleUrl: './modules.css'
})
export class Modules {
  constructor(private modulesService:ModulesService,private cdr: ChangeDetectorRef){}
  loading=false;
  modules: module[] = []; 
  totalRecords: number = 0;
  first: number = 0;
  rows: number = 10;
 successMessage='';
 errorMessage='';
  ngOnInit() {
    this.loadModules(this.first,this.rows);    
  } 
loadModules(first: number, rows: number) {
  this.loading = true;
  this.modulesService.getmodules(first, rows).subscribe({
    next: (data) => {
      // Defer update to avoid NG0100
      Promise.resolve().then(() => {
        this.modules = data.items.map((item: any) => ({ ...item, isEditing: false }));
        this.totalRecords = data.total;
        this.loading = false;
        this.cdr.detectChanges(); // extra safety
      });
    },
    error: (err) => {
      console.error('Error loading modules:', err);
      this.loading = false;
      this.errorMessage=err.message;
    }
  });
}


  onPageChange(event: any) { 
    this.first = event.first;
   this.loading=false;
    this.rows = event.rows;
    this.loadModules(this.first, this.rows);
   
  } 
  addRow() {
    this.modules =  [{ moduleName: '', isNew: true, isEditing: true,id:'' }, ...this.modules];
  }
  editRow(row: module) {
    row.isEditing = true;
  }
  deleteRow(id: number,index:number) {

    this.modulesService.deleteModule(id).subscribe({
      next:reponse=>{
          this.successMessage=reponse.message;
           this.modules.splice(index, 1);
           this.modules = [...this.modules];
          
           this.cdr.detectChanges();
      },
      error: (err) =>{ console.error('Error deleting modules:', err);this.errorMessage=err.message;  }
    });
   
  }
saveRow(row: module, index: number) {
  const serviceCall = row.isNew
    ? this.modulesService.createModule(row)
    : this.modulesService.updateModule(row);
  serviceCall.subscribe({
    next: (response) => {
      row.isNew = false;
      row.isEditing = false;
      row.id = response.data.id;
        this.successMessage=response.message;
      // Defer table reload to avoid NG0100
      Promise.resolve().then(() => {
        this.loadModules(this.first / this.rows, this.rows);
      });
    },
    error: (err) =>{ console.error('Error saving role:', err);this.errorMessage=err.message;}
  });
}


 cancelEdit(row:module, index: number) {
    if (row.isNew) 
      this.modules.splice(index, 1); // remove new row
    else 
      row.isEditing = false; // revert to view mode
  }
}




