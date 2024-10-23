import { Component } from '@angular/core';
import { NavbarComponent } from '../../component/front/navbar-front/navbar-front.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavbarComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home.component.html',
  styleUrl: './home.component.sass'
})
export class HomeComponent {

}
