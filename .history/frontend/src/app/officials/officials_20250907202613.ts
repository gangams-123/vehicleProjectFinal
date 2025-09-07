import { ChangeDetectorRef, Component } from '@angular/core';
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
import { OfficialService } from './official-service';
import { defaultPassword } from '../constants/constants';
//grid
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { finalize } from 'rxjs';
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
    fName: new FormControl(''),
    mName: new FormControl(''),
    lName: new FormControl(''),
    email: new FormControl(''),
    gender: new FormControl(''),
    dob: new FormControl(''),
    guardianName: new FormControl(''),
    guardianNum: new FormControl(''),
    relationship: new FormControl(''),
    mobile:new FormControl(''),
    joiningDate:new FormControl(''),
    basicsal:new FormControl(''),
    pf:new FormControl(''),
    esi:new FormControl(''),
    pfno:new FormControl(''),
    esino:new FormControl(''),
    branchId:new FormControl(''),
    departmentId:new FormControl(''),
    password:new FormControl(''),
    designationId:new FormControl(''),
   Address: new FormGroup({
    permanent: new FormGroup({
      street: new FormControl(''),
      selCountry: new FormControl(''),  // Country dropdown selection
      country: new FormControl(''),     // Country name to save
      state: new FormControl(''),
      city: new FormControl(''),
      pinCode: new FormControl(''),
      addressType:new FormControl('')
    }),
    present: new FormGroup({
      street: new FormControl(''),
      selCountry: new FormControl(''),
      country: new FormControl(''),
      state: new FormControl(''),
      city: new FormControl(''),
      pinCode: new FormControl(''),
      addressType:new FormControl('')
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
    successMessage='';
   errorMessage='';
    countries: any[] = [];
  perStates: IState[] = [];
  sameAsPresentChecked=false;
   preStates:IState[]=[];
   constructor(private fb: FormBuilder,private route: ActivatedRoute,private router:Router
    ,private branchService:BranchService,private departmentService:DepartmentService,
    private designationService:DesignationService,private officialService:OfficialService,private cdr:ChangeDetectorRef
   ) {}
  ngOnInit(): void {
      this.countries= Country.getAllCountries();
    this.route.queryParams.subscribe(params => {
      if (params['view'] !== undefined) {
        this.view = (params['view'] == 'true');
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
     // Create FormData
  const formData = new FormData();

  // 1. Get form value
  const formValue = this.officialForm.value;

  // 2. Append top-level simple fields
  formData.append('fName', formValue.fName?? '');
  formData.append('mName', formValue.mName?? '');
  formData.append('lName', formValue.lName?? '');
  formData.append('email', formValue.email?? '');
  formData.append('gender', formValue.gender?? '');
  formData.append('dob', formValue.dob?? '');
  formData.append('guardianName', formValue.guardianName?? '');
  formData.append('guardianNum', formValue.guardianNum?? '');
  formData.append('relationship', formValue.relationship?? '');
  formData.append('mobile', formValue.mobile?? '');
  formData.append('joiningDate', formValue.joiningDate?? '');
  formData.append('basicsal', formValue.basicsal?? '');
  formData.append('pf', formValue.pf?? '');
  formData.append('esi', formValue.esi?? '');
  formData.append('pfno', formValue.pfno?? '');
  formData.append('esino', formValue.esino?? '');
  formData.append('branchId', formValue.branchId?? '');
  formData.append('departmentId', formValue.departmentId?? '');
  formData.append('designationId', formValue.designationId?? '');
if (formValue.Address?.permanent) 
  formValue.Address.permanent.addressType = 'permanent';
if (formValue.Address?.present) 
  formValue.Address.present.addressType = 'present';
formData.append('password',defaultPassword);
  
console.log(JSON.stringify(formValue.Address));
  // 3. Append nested Address object
  formData.append('Address', JSON.stringify(formValue.Address));
    //append files
     this.selectedFiles.forEach(file => {
    formData.append('files', file);
  });
    this.officialService.createOfficial(formData).pipe(finalize(() => {
       // this.saving = false;
        this.cdr.detectChanges(); // force Angular to update the template
      }))
      .subscribe({
          next: res => {
            this.successMessage=res.message;
           // this.editingId = null;
            this.view = true;
      }
    })
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
      permanent.patchValue(present.value);
       console.log('Copied Permanent Address:', permanent.value);
          permanent.disable();
     }else{
       permanent.enable();
       permanent.reset();
     }
}
  onCountryChange(type:'permanent'|'present',event:any){
     const selectedValue = event.value;
     const countryValues=selectedValue.split("~");
    if(type=='permanent'){
       this.perStates = State.getStatesOfCountry(countryValues[0]);
         const permanentAddress = this.officialForm.get('Address.permanent') as FormGroup;
          permanentAddress.patchValue({country:countryValues[1]});
        permanentAddress.patchValue({
          state: '',
          city: ''
        });
    }else{
      this.preStates = State.getStatesOfCountry(countryValues[0]);
         const presentAddress = this.officialForm.get('Address.present') as FormGroup;
          presentAddress.patchValue({country:countryValues[1]});
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
       error: (err) => {console.error('Error fetching officials:', err)}
    });
    this.departmentService.getAllDepartments().subscribe({
     next: (res) => {
        this.deptList = res.items; // ✅ Assign only the actual data here
    },
       error: (err) => {console.error('Error fetching officials:', err)}
    });
  }

}
