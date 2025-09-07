
import { ChangeDetectorRef, Component} from '@angular/core';
import { Router,RouterModule} from '@angular/router';
import { FormBuilder, FormControl, FormGroup,ReactiveFormsModule ,FormsModule, FormArray} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Country, State,  IState } from 'country-state-city';

// Angular Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ActivatedRoute } from '@angular/router';
import { Vendorsservice } from './vendorsservice';

//for grid
import { ButtonModule } from 'primeng/button';
import { TableModule, TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
@Component({
  selector: 'app-vendors',
   imports: [CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatGridListModule,
    MatRadioModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    RouterModule,
    MatCheckboxModule,
    FormsModule,
    //for grid
    ButtonModule,
    TableModule,
    PaginatorModule
  ],
  templateUrl: './vendors.html',
  styleUrl: './vendors.css'
})
export class Vendors {

  vendorForm = new FormGroup({
  companyName:  new FormControl(''),
  website: new FormControl(''),
  accountNo:  new FormControl(''),
  ifscCode:  new FormControl(''),
  mobileNo:  new FormControl(''),
  contactName:  new FormControl(''),
  contactEmail: new FormControl(''),
  gstNo: new FormControl(''),
  addresses: new FormArray([])
});
countries: any[] = [];
 states: IState[] = [];
 successMessage='';
 errorMessage='';
   constructor(private vendorsservice:Vendorsservice, private router:Router,private cdr: ChangeDetectorRef,
    private fb: FormBuilder,private route: ActivatedRoute) {}


  onSubmit() {
     this.vendorsservice.createVendors(this.vendorForm.value).subscribe({
       next: (res) => {
         this.successMessage=res.message;
         this.view=true;
         this.loadVendors(0,10);
        },
        error: (err) => {this.errorMessage=err.message;console.error('Error loading vendors:', err);}
    })
  }
  addVendor(){
      this.view=false;
      this.addAddress();
      this.countries= Country.getAllCountries();
  }
  //to get the addresses field from formgroup
  get addresses(): FormArray {
  return this.vendorForm.get('addresses') as FormArray;
}
addAddress() {
    const addressGroup = new FormGroup({
      street: new FormControl(''),
      city: new FormControl(''),
      state: new FormControl(''),
      pincode: new FormControl(''),
      selCountry:new FormControl(''),
      country:new FormControl('')
    });
    this.addresses.push(addressGroup);
        
  }
    // Remove a specific address block
  removeAddress(index: number) {
      if (this.addresses.length > 1) {
    this.addresses.removeAt(index);
  } else {
    // Optionally show a warning
    alert('At least one address is required');
  }
  }
     onCountryChange(index: number) {
    const country = this.addresses.at(index).get('selCountry')?.value;
    const countryValues=country.split("~");
    this.states = State.getStatesOfCountry(countryValues[0]);
    this.addresses.at(index).patchValue({ country: countryValues[1]});
    this.addresses.at(index).patchValue({ state: '', city: '' });  
  }
 //for grid
  vendors: any[] = [];
  totalRecords: number = 0;
  loading: boolean = false;
  expandedRows: { [key: string]: boolean } = {};
  first: number = 0;
  rows: number = 10;
  view=true;
  addressLoading: { [vendorId: string]: boolean } = {};
    ngOnInit() {
      this.route.queryParams.subscribe(params => {
        this.view = params['view'] === 'true'; // Ensure it's boolean
            this.loadVendors(this.first, this.rows);
   
      });
         
    }
  onRowExpand(event: TableRowExpandEvent) {
    const vendor = event.data;
    this.addressLoading[vendor.id] = true;
    this.vendorsservice.getVendorAddresses(vendor.id).subscribe({
      next:(addresses:any)=>{
           Promise.resolve().then(() => {
         vendor.Addresses = addresses;
        this.addressLoading[vendor.id] = false;
           });
      },
       error: (err) => {
      console.error('Error loading addresses:', err);
      this.errorMessage=err.message;
       }
    });
  }
  onRowCollapse(event: TableRowCollapseEvent) {
      delete this.expandedRows[event.data.id];      
  }
  loadVendors(first: number, rows: number) {
    this.loading = true;
    this.vendorsservice.getVendors(first, rows).subscribe((data: any) => {
         Promise.resolve().then(() => {
          this.vendors = data.items;
          this.expandedRows = {};
          this.totalRecords = Number(data.total); 
          this.loading = false;
          this.cdr.detectChanges(); // avoids NG0100
        });  
    });
  }
  onPageChange(event: any) { 
    this.first = event.first;
   this.loading=false;
    this.rows = event.rows;
    this.loadVendors(this.first, this.rows);
   
  }
}
