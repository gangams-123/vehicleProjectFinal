import { Component, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MakeService } from '../make/make-service';
import { ModelsService } from './models-service';
import { ReactiveFormsModule } from '@angular/forms';
interface model {
  modelName: string;
  makeId:string;
  isEditing?: boolean;
  isNew?: boolean;
  id:string;
}
@Component({
  selector: 'app-models',
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
  templateUrl: './models.html',
  styleUrl: './models.css'
})

export class Models {

  constructor(private makeService:MakeService,private cdr: ChangeDetectorRef,private ngZone:NgZone,private modelsService:ModelsService){}
  loading=false;
  totalRecords: number = 0;
  first: number = 0;
  rows: number = 10;
 successMessage='';
 errorMessage='';
 models:model[]=[];
  makes: any=[];
  ngOnInit() {
    this.loadModels(this.first,this.rows);    
  } 
loadModels(first: number, rows: number) {
  this.loading = true;
  this.modelsService.getModel(first, rows).subscribe({
    next: (data) => {
      // Defer update to avoid NG0100
      Promise.resolve().then(() => {
        this.models = data.items.map((item: any) => ({ ...item, isEditing: false }));
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
    this.loadModels(this.first, this.rows);
   
  } 
  addRow() {
       this.makeService.getAllMakes().subscribe({
      next:res=>{this.makes=res.items;
        this.cdr.detectChanges
      },
      error: (err) =>{ console.error('Error deleting makes:', err);this.errorMessage=err.message;  }
  });
   this.models =  [{ modelName: '',makeId:'', isNew: true, isEditing: true,id:'' }, ...this.models];
  }

  editRow(row: model) {
    row.isEditing = true;
     this.makeService.getAllMakes().subscribe({
      next:res=>{this.makes=res.items;
        this.cdr.detectChanges
      },
      error: (err) =>{ console.error('Error deleting models:', err);this.errorMessage=err.message;  }
  });
  }
  deleteRow(id: number,index:number) {

    this.modelsService.deleteModel(id).subscribe({
      next:reponse=>{
          this.successMessage=reponse.message;
           this.models.splice(index, 1);
           this.models = [...this.models];
          
           this.cdr.detectChanges();
      },
      error: (err) =>{ console.error('Error deleting makes:', err);this.errorMessage=err.message;  }
    });
   
  }
saveRow(row: model, index: number) {
  console.log(row);
  const serviceCall = row.isNew
    ? this.modelsService.createModel(row)
    : this.modelsService.updateModel(row);
  serviceCall.subscribe({
    next: (response) => {
      row.isNew = false;
      row.isEditing = false;
      row.id = response.data.id;
        this.successMessage=response.message;
      // Defer table reload to avoid NG0100
      Promise.resolve().then(() => {
        this.loadModels(this.first / this.rows, this.rows);
      });
    },
    error: (err) =>{ console.error('Error saving model:', err);this.errorMessage=err.message;}
  });
}


 cancelEdit(row:model, index: number) {
    if (row.isNew) 
      this.models.splice(index, 1); // remove new row
    else 
      row.isEditing = false; // revert to view mode
  }
}
