import { Component ,ChangeDetectorRef,NgZone} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
//for grid
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { MakeService } from './make-service';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
interface make {
  makeName: string;
  isEditing?: boolean;
  isNew?: boolean;
  id:string;
}
@Component({
  selector: 'app-make',
  imports: [CommonModule,PaginatorModule,TableModule,ButtonModule,MatInputModule,FormsModule,MatFormFieldModule],
  templateUrl: './make.html',
  styleUrl: './make.css'
})
export class Make {
  constructor(private makeService:MakeService,private cdr: ChangeDetectorRef,private ngZone:NgZone){}
  loading=false;
  makes: make[] = []; 
  totalRecords: number = 0;
  first: number = 0;
  rows: number = 10;
 successMessage='';
 errorMessage='';
  ngOnInit() {
    this.loadMakes(this.first,this.rows);    
  } 
loadMakes(first: number, rows: number) {
  this.loading = true;
  this.makeService.getMakes(first, rows).subscribe({
    next: (data) => {
      // Defer update to avoid NG0100
      Promise.resolve().then(() => {
        this.makes = data.items.map((item: any) => ({ ...item, isEditing: false }));
        this.totalRecords = data.total;
        this.loading = false;
        this.cdr.detectChanges(); // extra safety
      });
    },
    error: (err) => {
      console.error('Error loading makes:', err);
      this.loading = false;
      this.errorMessage=err.message;
    }
  });
}


  onPageChange(event: any) { 
    this.first = event.first;
   this.loading=false;
    this.rows = event.rows;
    this.loadMakes(this.first, this.rows);
   
  } 
  addRow() {
    this.makes =  [{ makeName: '', isNew: true, isEditing: true,id:'' }, ...this.makes];
  }
  editRow(row: make) {
    row.isEditing = true;
  }
  deleteRow(id: number,index:number) {

    this.makeService.deleteMake(id).subscribe({
      next:reponse=>{
          this.successMessage=reponse.message;
           this.makes.splice(index, 1);
           this.makes = [...this.makes];
          
           this.cdr.detectChanges();
      },
      error: (err) =>{ console.error('Error deleting makes:', err);this.errorMessage=err.message;  }
    });
   
  }
saveRow(row: make, index: number) {
  const serviceCall = row.isNew
    ? this.makeService.createMake(row)
    : this.makeService.updateMake(row);
  serviceCall.subscribe({
    next: (response) => {
      row.isNew = false;
      row.isEditing = false;
      row.id = response.data.id;
        this.successMessage=response.message;
      // Defer table reload to avoid NG0100
      Promise.resolve().then(() => {
        this.loadMakes(this.first / this.rows, this.rows);
      });
    },
    error: (err) =>{ console.error('Error saving make:', err);this.errorMessage=err.message;}
  });
}


 cancelEdit(row:make, index: number) {
    if (row.isNew) 
      this.makes.splice(index, 1); // remove new row
    else 
      row.isEditing = false; // revert to view mode
  }
}
