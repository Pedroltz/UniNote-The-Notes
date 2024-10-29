import { Component } from '@angular/core';
import { NavbarComponent } from './component/front/navbar-front/navbar-front.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `<router-outlet></router-outlet>`,
  styles: []
})
export class AppComponent { }
