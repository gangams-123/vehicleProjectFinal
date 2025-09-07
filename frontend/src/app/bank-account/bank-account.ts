import { Component,ChangeDetectorRef } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatRippleModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BankAccountService } from './bank-account-service';
import { ActivatedRoute } from '@angular/router';
import { Router} from '@angular/router';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule, TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIcon } from  '@angular/material/icon';
import { finalize } from 'rxjs';


@Component({
  selector: 'app-bank-account',
  imports: [MatButtonModule, MatCardModule, MatProgressSpinnerModule,MatIcon, MatRippleModule, MatInputModule, ButtonModule, CommonModule, ReactiveFormsModule, MatFormFieldModule, PaginatorModule, TableModule, MatIcon],
  templateUrl: './bank-account.html',
  styleUrl: './bank-account.css'
})
export class BankAccount {
   accountForm = new FormGroup({
    accountNo: new FormControl(''),
    bankName:new FormControl(''),
    ifscCode: new FormControl(''),
    address: new FormControl(''),
    totalAmount: new FormControl(''),
    files: new FormArray<FormGroup>([])
  });
    constructor(private fb: FormBuilder,private bankAccountService: BankAccountService,
    private route: ActivatedRoute,private router:Router,private cdr:ChangeDetectorRef) {}
  view=true;
  saving: boolean = false;
  editable=false;
   ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['view'] !== undefined) {
        this.view = (params['view'] == 'true');
      }
    });  
    this.loadAccounts(this.first,this.rows);     
  }  
    // Getter for FormArray controls
  get filesControls(): FormArray {
    return this.accountForm.get('files') as FormArray;
  }
  selectedFiles: File[] = [];


onFilesSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files) {
    this.selectedFiles = Array.from(input.files); // just keep reference
  }
}
addAccount(){
  this.view=false;
  this.editable=false;
  this.successMessage='';
  this.errorMessage='';
  this.selectedFiles = [];
  this.existingFiles=[];
  this.accountForm.reset(); 

}
convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    console.log(file.name);
    const reader = new FileReader();
    reader.readAsDataURL(file);  // encodes file as base64
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}
successMessage: string = '';
errorMessage:string='';
success: boolean = false;
onSubmit() {

    if (this.saving) return; // prevent double click
  this.saving = true;
  const formData = new FormData();

  // Add normal form fields
 formData.append('accountNo', this.accountForm.get('accountNo')?.value ?? '');
formData.append('bankName', this.accountForm.get('bankName')?.value ?? '');
formData.append('ifscCode', this.accountForm.get('ifscCode')?.value ?? '');
formData.append('address', this.accountForm.get('address')?.value ?? '');
formData.append('totalAmount', this.accountForm.get('totalAmount')?.value ?? '');
  // Add all files
  this.selectedFiles.forEach(file => {
    formData.append('files', file);
  });
  // Send request
  if (this.editingId) {
    formData.append('id', String(this.editingId));
   formData.append("removedFiles", JSON.stringify(this.removedFiles));
    this.bankAccountService.updateAccount(formData)  .pipe(finalize(() => {
    this.saving = false;
    this.cdr.detectChanges(); // force Angular to update the template
  }))
  .subscribe({
      next: res => {
        this.successMessage=res.message;
        this.editingId = null;
        this.view = true;
        this.loadAccounts(this.first, this.rows);
      },
      error: err => {  console.error('Update error:', err); this.errorMessage=err; }
    });
  } else {
  this.bankAccountService.createAccount(formData) .pipe(finalize(() => {
    this.saving = false;
    this.cdr.detectChanges(); // force Angular to update the template
  }))
  .subscribe({
    next: res => {  this.view = true;
        this.successMessage=res.message; this.loadAccounts(this.first, this.rows);},
    error: err => { console.error('Error:', err);this.errorMessage=err;}
  });
}
}

//for grid
  accounts = []; 
  totalRecords: number = 0;
  first: number = 0;
  rows: number = 10;
    loading: boolean = false;
  expandedRows: { [key: string]: boolean } = {};
    filesLoading: { [accountId: string]: boolean } = {};
loadAccounts(first: number, rows: number) {
  this.loading = true;
  this.bankAccountService.getAccounts(first, rows).subscribe({
    next: (data) => {
      // Defer update to avoid NG0100
      Promise.resolve().then(() => {
        this.accounts = data.items.map((item: any) => ({ ...item, isEditing: false }));
        this.totalRecords = data.total;
        this.loading = false;
        this.cdr.detectChanges(); // extra safety
      });
    },
    error: (err) => {
      console.error('Error loading makes:', err);
      this.loading = false;
    }
  });
}
  onPageChange(event: any) { 
    this.first = event.first;
   this.loading=false;
    this.rows = event.rows;
    this.loadAccounts(this.first, this.rows);
   
  } 
 onRowExpand(event: TableRowExpandEvent) {
  const account = event.data;
  this.expandedRows[account.id] = true;   // ✅ keep existing rows expanded
}

onRowCollapse(event: TableRowCollapseEvent) {
  delete this.expandedRows[event.data.id];  // ✅ remove collapsed one
}
openFile(id: any, event?: Event) {
  if (event) event.preventDefault(); // prevent page reload

  this.bankAccountService.getFileContent(id)
    .subscribe({
      next: (blob) => {
        console.log(blob);
        const url = window.URL.createObjectURL(blob);
        window.open(url); // open in new tab
      },
      error: (err) => {
        console.error('Failed to open file', err);
        alert('Could not open file.');
      }
    });
}


// Helper: base64 string -> Uint8Array


// Convert base64 string to Blob

editingId: number | null = null;
removedFiles:{id:number}[]=[];
existingFiles: { id: number, name: string }[] = []; // for backend-returned files
removeExistingFile(id:any){
  this.removedFiles.push(id);
   this.existingFiles = this.existingFiles.filter(file => file.id !== id);
}
editAccount(account:any){
this.view = false;

  // patch values into the form
 this.accountForm.patchValue(account);

  // keep track of editing account id
  this.editingId = account.id;

  // clear previous selected files
  this.selectedFiles = [];
   // populate existing files (coming from backend)
  this.existingFiles = account.Files?.map((f: any) => ({
    id: f.id,      // if backend sends fileId
    name: f.fileName   // filename
  })) || [];

}
deleteAccount(id: number,index:number) {

    this.bankAccountService.deleteAccount(id).subscribe({
 
      next:reponse=>{
            Promise.resolve().then(() => {
          this.successMessage=reponse.message;
           this.accounts.splice(index, 1);
           this.accounts = [...this.accounts];
           console.log(this.accounts);
           this.cdr.detectChanges();
            });
      },
      error: (err) =>{ console.error('Error deleting makes:', err);this.errorMessage=err;  }
    });
  }


}
