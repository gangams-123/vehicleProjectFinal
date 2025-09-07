import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';
import { Header } from '../header/header';
import { RouterOutlet }  from '@angular/router';
@Component({
  selector: 'app-landing',
  imports: [RouterModule,Sidebar,Header,RouterOutlet],
  templateUrl: './landing.html',
  styleUrl: './landing.css'
})
export class Landing {

}
