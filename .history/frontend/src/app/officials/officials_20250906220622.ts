import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ActivatedRoute } from '@angular/router';
import { Router,RouterModule} from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Country, State,  IState } from 'country-state-city';
import { BranchService } from '../branch/branch-service';
import { DepartmentService } from '../department/department-service';
import { DesignationService } from '../designation/designation-service';
//grid
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
@Component({
  selector: 'app-officials',
    imports: [ CommonModule,
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
    //for grid
    PaginatorModule,
    TableModule

    ],
  templateUrl: './officials.html',
  styleUrl: './officials.css'
})
export class Officials {
 officialForm = new FormGroup({
    fname: new FormControl(''),
    mname: new FormControl(''),
    lname: new FormControl(''),
    email: new FormControl(''),
    gender: new FormControl(''),
    dob: new FormControl(''),
    guardianname: new FormControl(''),
    guardiannum: new FormControl(''),
    relationship: new FormControl(''),
    mobile:new FormControl(''),
    joiningdate:new FormControl(''),
    basicsal:new FormControl(''),
    pf:new FormControl(''),
    esi:new FormControl(''),
    pfno:new FormControl(''),
    esino:new FormControl(''),
    branchId:new FormControl(''),
    departmentId:new FormControl(''),
    designationId:new FormControl(''),
   Address: new FormGroup({
    permanent: new FormGroup({
      street: new FormControl(''),
      selCountry: new FormControl(''),  // Country dropdown selection
      country: new FormControl(''),     // Country name to save
      state: new FormControl(''),
      city: new FormControl(''),
      pinCode: new FormControl('')
    }),
    present: new FormGroup({
      street: new FormControl(''),
      selCountry: new FormControl(''),
      country: new FormControl(''),
      state: new FormControl(''),
      city: new FormControl(''),
      pinCode: new FormControl('')
    })
  }),
  files: new FormArray<FormGroup>([])
  });
    pfBox=false;
  esiBox=false;
  deptList: any[] = [];
  designationList: any[] = [];
  branchList:any[]=[];
  officials:any[]=[];
  view=true;
    countries: any[] = [];
  perStates: IState[] = [];
  sameAsPresentChecked=false;
   preStates:IState[]=[];
   constructor(private fb: FormBuilder,private route: ActivatedRoute,private router:Router
    ,private branchService:BranchService,private departmentService:DepartmentService,private designationService:DesignationService
   ) {}
  ngOnInit(): void {
      this.countries= Country.getAllCountries();
    this.route.queryParams.subscribe(params => {
      if (params['view'] !== undefined) {
        this.view = (params['view'] == 'true');
        console.log(this.view);
      }
    });
  }  
   toggleTextbox(){
    this.pfBox=true;
  }
    toggleTextboxForesi(){
    this.esiBox=true;
  }
  
  selectedFiles: File[] = [];
  onFilesSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files) {
    this.selectedFiles = Array.from(input.files); // just keep reference
  }
}
  onSubmit() {
    console.log(this.officialForm.value);
  } 
   onDepartmentChange(deptId: number) {
 this.designationService.getDesignationByDept(deptId).subscribe((res: any) => {
    this.designationList=res.items;
 
  });
} 
toggleSameAsPresent(event:any){
  const addressGroup = this.officialForm.get('Address') as FormGroup;
    const present = addressGroup.get('present') as FormGroup;
    const permanent = addressGroup.get('permanent') as FormGroup;
     if (event.checked) {
      permanent.patchValue(preset=nt.value);
     }
}
  onCountryChange(type:'permanent'|'present',event:any){
     const selectedValue = event.value;
     const countryValues=selectedValue.split("~");
   console.log(type);
   console.log(type=='permanent');
    if(type=='permanent'){
       this.perStates = State.getStatesOfCountry(countryValues[0]);
         const permanentAddress = this.officialForm.get('Address.permanent') as FormGroup;
        permanentAddress.patchValue({
          state: '',
          city: ''
        });
    }else{
      this.preStates = State.getStatesOfCountry(countryValues[0]);
         const presentAddress = this.officialForm.get('Address.present') as FormGroup;
        presentAddress.patchValue({
          state: '',
          city: ''
        });
    }
    
  } 

  AddOfficial(){
    this.view=false;
    this.countries= Country.getAllCountries(); 
    this.branchService.getAllBranches().subscribe({
     next: (res) => {
        this.branchList = res.items; // ✅ Assign only the actual data here
    },
       error: (err) => {console.error('Error fetching branches:', err)}
    });
    this.departmentService.getAllDepartments().subscribe({
     next: (res) => {
        this.deptList = res.items; // ✅ Assign only the actual data here
    },
       error: (err) => {console.error('Error fetching branches:', err)}
    });
  }

}
