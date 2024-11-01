import { Component } from '@angular/core';
import { NavbarComponent } from './front-components/navbar-front/navbar-front.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styles: []
})
export class AppComponent { }
