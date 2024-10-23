import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';
import { FolderViewComponent } from './components/folder-view/folder-view.component';
import { DocumentEditorComponent } from './components/document-editor/document-editor.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

export const routes: Routes = [
  { path: '', redirectTo: 'folder/root', pathMatch: 'full' },
  { path: 'folder/:id', component: FolderViewComponent },
  { path: 'document/:id', component: DocumentEditorComponent },
  { path: 'home', component: HomeComponent},
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: '**', redirectTo: 'folder/root' }
  
];

export const appRoutingProviders = [provideRouter(routes)];
