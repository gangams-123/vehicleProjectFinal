
import { ChangeDetectorRef, Component} from '@angular/core';
import { Router,RouterModule} from '@angular/router';
import { FormBuilder, FormControl, FormGroup,ReactiveFormsModule ,FormsModule, FormArray} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatOptionModule } from '@angular/material/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { WorkflowService } from './workflow-service';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule, TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import {MODULES,Status_Expense,workFlowCount,workFlowStatus}from  '../constants/constants';
import { RolesService } from '../roles/roles-service';
type WorkflowStatus = typeof workFlowStatus[number];
@Component({
  selector: 'app-workflow',
   imports: [CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatSlideToggleModule,
    RouterModule,
    FormsModule,
    //for grid
    ButtonModule,
    TableModule,
    PaginatorModule
  ],
  templateUrl: './workflow.html',
  styleUrl: './workflow.css'
})
export class Workflow {

  workflowForm = new FormGroup({
  noofWorkFlow:  new FormControl(''),
  module: new FormControl(''),
  status:new FormControl(''),
  workFlows: new FormArray([])
});
  readonly wfStatusArray = workFlowStatus;
 statusToggle: WorkflowStatus = this.wfStatusArray[0];
 successMessage='';
 view=true;
 errorMessage='';
 status:any=Status_Expense;
 
 modules:any=MODULES;
 numbers: number[] = Array.from({ length: workFlowCount }, (_, i) => i + 1); // Creates [1, 2, 3, 4, 5, 6]
 
   constructor(private workflowService:WorkflowService, private rolesService:RolesService,private router:Router,private cdr: ChangeDetectorRef,
    private fb: FormBuilder,private route: ActivatedRoute) {}
  onSubmit(){
 
  this.workflowForm.patchValue({status: workFlowStatus[0]});
     this.workflowService.createWorkFlow(this.workflowForm.value).subscribe({
          next:res=>{
           this.successMessage=res.message;
           this.view=true;
            this.loadWorkFlows(0,10,this.statusToggle);
          },
         error: (err) => {
                    console.error('Error loading roles:', err);
                     this.errorMessage=err.message;
       }
      });  
  }
  get workFlows(): FormArray {
  return this.workflowForm.get('workFlows') as FormArray;
}
addWorkFlows(event: MatSelectChange) {
  const numSelected=Number(event.value);
  for(let i=1;i<=numSelected;i++){ 
    const workFlowGroup = new FormGroup({
      status: new FormControl(''),
      roleId: new FormControl(''),
    });
    this.workFlows.push(workFlowGroup);     
  }
}  
    workFlowsData: any[] = [];
  totalRecords: number = 0;
  
  loading: boolean = false;
  expandedRows: { [key: string]: boolean } = {};
  first: number = 0;
  rows: number = 10;
 flowsLoading: { [workFlowId: string]: boolean } = {};
 roles:any[]=[];
   ngOnInit() {
      this.route.queryParams.subscribe(params => {
        this.view = params['view'] === 'true'; // Ensure it's boolean
            this.loadWorkFlows(this.first, this.rows,this.statusToggle);
      });
         this.rolesService.getAllRoles().subscribe({
          next:res=>{
            this.roles=res.items;
          },
         error: (err) => {
                    console.error('Error loading roles:', err);
                     this.errorMessage=err.message;
       }
      });   
    }
    checkWorkFlowExists(event: MatSelectChange) {
    const module=event.value;
    this.workflowService.getWorkFlowByModule(module,workFlowStatus[0]).subscribe({
      next:(res:any)=>{
        if (res.data) {
          this.errorMessage = 'Workflow already exists for this module.To add/update change the current workflow to old';
          this.workflowForm.patchValue({ module: '' }); // clear selection
        } 
      },
       error: (err) => {
       }
    });
}
addWorkFlow(){
      this.view=false;
      this.successMessage='';
  this.errorMessage='';
  }
onRowExpand(event: TableRowExpandEvent) {
  const workFlow = event.data;
  this.expandedRows[workFlow.id] = true;   // ✅ keep existing rows expanded
}

onRowCollapse(event: TableRowCollapseEvent) {
  delete this.expandedRows[event.data.id];  // ✅ remove collapsed one
}
changeStatus(id:number){

}
  onPageChange(event: any) { 
    this.first = event.first;
   this.loading=false;
    this.rows = event.rows;
    this.loadWorkFlows(this.first, this.rows,this.statusToggle);
   
  }
  loadWorkFlows(first: number, rows: number,status:string) {
this.loading = true;
    this.workflowService.getWorkFlows(first, rows,status).subscribe((data: any) => {
         Promise.resolve().then(() => {
          this.workFlowsData = data.items;
          this.expandedRows = {};
          this.totalRecords = Number(data.total); 
          this.loading = false;
          this.cdr.detectChanges(); // avoids NG0100
        });  
    });
  }
onStatusToggleChange(event:any){
         const  newValue= this.statusToggle = event.checked ? this.wfStatusArray[0] : this.wfStatusArray[1];
         this.loading=true;
 this.loadWorkFlows(0,10,newValue);

}
onStatusChange(workFlow:any,event:any){
        const newStatus = event.checked ? this.wfStatusArray[0] : this.wfStatusArray[1];
      const module=workFlow.module;
      if(newStatus===this.wfStatusArray[0]){
        this.workflowService.getWorkFlowByModule(module,this.wfStatusArray[0]).subscribe({
      next:(res:any)=>{
        if (res.data) {
            event.source.checked = !event.checked;
          this.errorMessage = 'active Workflow already exists change it to old to use it';

        } else{
 const id=workFlow.id;
       this.workflowService.changeStatus(workFlowStatus[0],id).subscribe({
      next:(res:any)=>{
          this.successMessage =res.message; 
          this.loadWorkFlows(0,10,workFlowStatus[0]);
      },
       error: (err) => {
       }
    });
        }
      },
       error: (err) => {

       }
    });
    }else{
      const id=workFlow.id;
       this.workflowService.changeStatus(workFlowStatus[1],id).subscribe({
      next:(res:any)=>{
          this.successMessage =res.message; 
          this.loadWorkFlows(0,10,workFlowStatus[0]);
      },
       error: (err) => {
       }
    });
    }

  }
}
