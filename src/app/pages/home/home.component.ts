import { Component } from '@angular/core';
import { NavbarFrontComponent } from '../../front-components/navbar-front/navbar-front.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FooterComponent } from "../../front-components/footer/footer.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavbarFrontComponent, FooterComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
