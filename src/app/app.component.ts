import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { RouterOutlet } from '@angular/router';
import { NavbarFrontComponent } from './front-components/navbar-front/navbar-front.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './front-components/footer/footer.component';
import { CommonModule } from '@angular/common'; // Importar CommonModule
import { FolderViewComponent } from './components/folder-view/folder-view.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarFrontComponent,
    NavbarComponent,
    FooterComponent,
    CommonModule // Adicionar CommonModule aos imports
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] // Certifique-se de ter este arquivo
})
export class AppComponent implements OnInit {
toggleSidebar() {
throw new Error('Method not implemented.');
}
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  isHome: boolean = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Defina quais URLs são consideradas como Home
      // Ajuste '/' e '/home' conforme a sua configuração de rotas
      this.isHome = event.urlAfterRedirects === '/' || event.urlAfterRedirects === '/home';
    });
  }
}
