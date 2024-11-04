import { Component } from '@angular/core';
import { ButtonComponent } from "../button/button.component";
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-navbar-front',
  standalone: true,
  imports: [ButtonComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './navbar-front.component.html',
  styleUrls: ['./navbar-front.component.sass'] 
})
export class NavbarFrontComponent {
  isMenuOpen: boolean = false;

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }  
}
