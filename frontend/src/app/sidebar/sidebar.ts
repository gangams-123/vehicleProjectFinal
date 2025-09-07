import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import{CommonModule}from '@angular/common'
import {list} from './sidebaritems';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-sidebar',
  imports: [MatListModule,MatIconModule,CommonModule,RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {
  menu=list;
  toggleMenu(item: any) {
    item.open = !item.open;
  }
}
