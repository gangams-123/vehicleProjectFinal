import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router,RouterModule} from '@angular/router';
@Component({
  selector: 'app-branches',
  imports: [CommonModule,RouterModule],
  templateUrl: './branches.html',
  styleUrl: './branches.css'
})
export class Branches {
  private router = inject(Router);
 
 urls = [
{
   "url":"favicon.ico",
  "name":"kolkatta branch"
},
{
 "url":"favicon.ico",
  "name":"banglore branch"
},
{
 "url":"favicon.ico",
  "name":"mysore branch"
}
];
   imageClick(url:string,name:string){
      this.router.navigate(['/mainp']);
   
   }

}
