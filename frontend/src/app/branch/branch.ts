import { Component, ChangeDetectorRef } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatRippleModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BranchService } from './branch-service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute } from '@angular/router';
import { MatOptionModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { Router } from '@angular/router';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule, TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { MatInputModule } from '@angular/material/input';
import { Country, State, IState } from 'country-state-city';
import { finalize } from 'rxjs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { officeTypes } from '../constants/constants';
import { MatNativeDateModule } from '@angular/material/core';
@Component({
  selector: 'app-branch',
  imports: [
    MatButtonModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    FormsModule,
    MatCardModule,
    MatRadioModule,
    MatSelectModule,
    MatRippleModule,
    MatDatepickerModule,
    MatOptionModule,
    MatInputModule,
    ButtonModule,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    PaginatorModule,
    TableModule,
  ],
  templateUrl: './branch.html',
  styleUrl: './branch.css',
})
export class Branch {
  countries: any[] = [];
  states: IState[] = [];
  officeTypes: any = officeTypes;
  successMessage = '';
  errorMessage = '';
  branchForm = new FormGroup({
    branchName: new FormControl(''),
    emailId: new FormControl(''),
    url: new FormControl(''),
    mobileNum: new FormControl(''),
    phoneNum: new FormControl(''),
    officeType: new FormControl(''),
    files: new FormArray<FormGroup>([]),
    Address: new FormGroup({
      street: new FormControl(''),
      selCountry: new FormControl(''),
      country: new FormControl(''),
      state: new FormControl(''),
      city: new FormControl(''),
      pinCode: new FormControl(''),
    }),
  });

  constructor(
    private fb: FormBuilder,
    private branchService: BranchService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}
  view = true;
  saving: boolean = false;
  editable = false;
  totalRecords: number = 0;
  first: number = 0;
  rows: number = 10;
  loading: boolean = false;
  filesLoading: { [brnchId: string]: boolean } = {};
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['view'] !== undefined) {
        this.view = params['view'] == 'true';
      }
    });

    this.loadBranches(this.first, this.rows);
  }
  // Getter for FormArray controls
  get filesControls(): FormArray {
    return this.branchForm.get('files') as FormArray;
  }

  selectedFiles: File[] = [];
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

    const branch = {
      branchName: this.branchForm.get('branchName')?.value ?? '',
      emailId: this.branchForm.get('emailId')?.value ?? '',
      mobileNum: this.branchForm.get('mobileNum')?.value ?? '',
      phoneNum: this.branchForm.get('phoneNum')?.value ?? '',
      establishedDate: this.branchForm.get('establishedDate')?.value ?? '',
    };
    formData.append('branchData', JSON.stringify(branch));

    // Append Address fields
    const addressGroup = this.branchForm.get('Address') as FormGroup;
    const address = [
      {
        street: addressGroup.get('street')?.value ?? '',
        country: addressGroup.get('country')?.value ?? '',
        state: addressGroup.get('state')?.value ?? '',
        city: addressGroup.get('city')?.value ?? '',
        pinCode: addressGroup.get('pinCode')?.value ?? '',
      },
    ];
    console.log(address);
    // Convert address object to JSON string
    formData.append('addressData', JSON.stringify(address));
    this.selectedFiles.forEach((file) => {
      formData.append('files', file);
    });
    // Send request
    //  if (this.editingId) {
    //  formData.append('id', String(this.editingId));
    //formData.append("removedFiles", JSON.stringify(this.removedFiles));
    console.log(formData);
  } // else {
  //this.bankAccountService.createAccount(formData) .pipe(finalize(() => {
  //     this.saving = false;
  //     this.cdr.detectChanges(); // force Angular to update the template
  //   }))
  //   .subscribe({
  //     next: res => {  this.view = true;
  //         this.successMessage=res.message; this.loadAccounts(this.first, this.rows);},
  //     error: err => { console.error('Error:', err);this.errorMessage=err;}
  //   });
  // }
  branches: any[] = [];
  loadBranches(first: number, rows: number) {
    this.loading = true;
    this.branchService.getBranch(first, rows).subscribe({
      next: (res) => {
        res.data.forEach((item: any) => {
          Promise.resolve().then(() => {
            this.branches.push({
              ...item.branch,
              addressData: item.addressData,
              file: item.file,
              isEditing: false,
            });

            this.totalRecords = res.total;
            this.loading = false;
            this.cdr.detectChanges();
          });
        });
      },
      error: (err) => {
        console.error('Error loading branches:', err);
        this.loading = false;
      },
    });
  }

  onCountryChange() {
    const addressGroup = this.branchForm.get('Address') as FormGroup;
    const country = addressGroup.get('selCountry')?.value;
    const countryValues = country.split('~');
    this.states = State.getStatesOfCountry(countryValues[0]);
    addressGroup.patchValue({
      country: countryValues[1], // Save country name
      state: '', // Reset state
      city: '', // Reset city
    });
  }
  onPageChange(event: any) {
    this.first = event.first;
    this.loading = false;
    this.rows = event.rows;
    this.loadBranches(this.first, this.rows);
  }
  expandedAddresses: { [key: number]: boolean } = {};
  expandedFiles: { [key: number]: boolean } = {};
  toggleAddressRow(branchId: number) {
    this.expandedAddresses[branchId] = !this.expandedAddresses[branchId];
  }

  isAddressExpanded(branchId: number): boolean {
    return !!this.expandedAddresses[branchId];
  }

  // File toggle methods
  toggleFileRow(branchId: number) {
    this.expandedFiles[branchId] = !this.expandedFiles[branchId];
  }

  isFileExpanded(branchId: number): boolean {
    return !!this.expandedFiles[branchId];
  }
  openFile(id: any, event?: Event) {
    if (event) event.preventDefault(); // prevent page reload

    this.branchService.getFileContent(id).subscribe({
      next: (blob) => {
        console.log(blob);
        const url = window.URL.createObjectURL(blob);
        window.open(url); // open in new tab
      },
      error: (err) => {
        console.error('Failed to open file', err);
        alert('Could not open file.');
      },
    });
  }
  deleteBranch(id: number, index: number) {}
  editBranch(branch: any) {}

  AddBranch() {
    this.view = false;
    this.countries = Country.getAllCountries();
  }
}
