import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentService } from '../../services/document.service';
import { Document } from '../../models/document.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-document-editor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavbarComponent,
    SidebarComponent,
    MatSidenavModule,
    MatButtonModule
  ],
  templateUrl: './document-editor.component.html',
  styleUrls: ['./document-editor.component.css']
})
export class DocumentEditorComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  document!: Document;
  sidebarOpened = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private documentService: DocumentService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const docId = params.get('id');
      if (docId) {
        const doc = this.documentService.getDocumentById(docId);
        if (doc) {
          this.document = doc;
        } else {
          this.router.navigate(['/']);
        }
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  saveDocument() {
    this.router.navigate(['/folder', this.document.folderId]);
  }

  toggleSidebar() {
    this.sidebarOpened = !this.sidebarOpened;
  }

  onSidebarClosed() {
    this.sidebarOpened = false;
  }
  
  onFolderSelected() {
    this.sidenav.close();
    this.sidebarOpened = false;
  }
}
