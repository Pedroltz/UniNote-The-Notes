import { Component } from '@angular/core';
import { ButtonComponent } from "../button/button.component";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ButtonComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './navbar-front.component.html',
  styleUrls: ['./navbar-front.component.sass'] 
})
export class NavbarComponent {
  isMenuOpen: boolean = false;

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }  
}
