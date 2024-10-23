// src/app/components/folder-view/folder-view.component.ts

import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FolderService } from '../../services/folder.service';
import { DocumentService } from '../../services/document.service';
import { Folder } from '../../models/folder.model';
import { Document } from '../../models/document.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { DragDropModule, CdkDragDrop, CdkDragMove } from '@angular/cdk/drag-drop';
import { Subscription } from 'rxjs';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFolder, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NewFolderDialogComponent } from '../new-folder-dialog/new-folder-dialog.component';
import { NewDocumentDialogComponent } from '../new-document-dialog/new-document-dialog.component';

@Component({
  selector: 'app-folder-view',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavbarComponent,
    SidebarComponent,
    MatSidenavModule,
    MatButtonModule,
    DragDropModule,
    FontAwesomeModule,
    MatDialogModule,
  ],
  templateUrl: './folder-view.component.html',
  styleUrls: ['./folder-view.component.css'],
})
export class FolderViewComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  @ViewChild('targetItem') targetItem!: ElementRef;

  currentFolder!: Folder;
  folderDropListIds: string[] = [];
  sidebarOpened = false;

  textSize = 14;

  private folderSubscription!: Subscription;
  private routeSubscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private folderService: FolderService,
    private documentService: DocumentService,
    private library: FaIconLibrary,
    private dialog: MatDialog
  ) {
    // Adicionar os ícones à biblioteca
    library.addIcons(faFolder, faFileAlt);
  }

  ngOnInit(): void {
    // Assinar para mudanças na rota
    this.routeSubscription = this.route.paramMap.subscribe((params) => {
      const folderId = params.get('id')!;
      this.updateCurrentFolder(folderId);
    });

    // Assinar para atualizações das pastas
    this.folderSubscription = this.folderService.folders$.subscribe(() => {
      if (this.currentFolder) {
        // Atualizar a pasta atual
        this.updateCurrentFolder(this.currentFolder.id);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.folderSubscription) {
      this.folderSubscription.unsubscribe();
    }
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  private updateCurrentFolder(folderId: string) {
    const folder = this.folderService.getFolderById(folderId);
    if (!folder) {
      this.router.navigate(['/folder', 'root']);
      return;
    }

    this.currentFolder = folder;
    // Atualizar a lista de IDs das pastas para arrastar e soltar
    this.folderDropListIds = this.currentFolder.children.map((folder) => folder.id);
    this.folderDropListIds.push('documentsList');
  }

  openFolder(id: string) {
    this.router.navigate(['/folder', id]);
  }

  openDocument(id: string) {
    // Navega para a rota do documento
    this.router.navigate(['/document', id]);
  }

  openNewFolderDialog() {
    const dialogRef = this.dialog.open(NewFolderDialogComponent, {
      width: '350px', // Aumenta a largura para acomodar o campo maior
      backdropClass: 'custom-dialog-backdrop',
      panelClass: 'custom-dialog-panel', // Classe personalizada para estilos
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && this.currentFolder) {
        this.folderService.createFolder(result, this.currentFolder.id);
      }
    });
  }

  createNewDocument() {
    const dialogRef = this.dialog.open(NewDocumentDialogComponent, {
      width: '350px', // Aumenta a largura para acomodar o campo maior
      backdropClass: 'custom-dialog-backdrop',
      panelClass: 'custom-dialog-panel', // Classe personalizada para estilos
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && this.currentFolder) {
        const doc = this.documentService.createDocument(result, this.currentFolder.id);
        this.openDocument(doc.id);
      }
    });
  }

  onDrag(event: CdkDragMove): void {
    const draggedElement = event.source.element.nativeElement;
    if (!this.targetItem) return; // Garantir que targetItem existe
    const targetElement = this.targetItem.nativeElement;

    const isColliding = this.isColliding(draggedElement, targetElement);

    if (isColliding) {
      console.log('Colidiu com outro item!');
    }
  }

  onDragEnd(): void {
    console.log('Arraste finalizado');
  }

  isColliding(draggedElement: HTMLElement, targetElement: HTMLElement): boolean {
    const draggedRect = draggedElement.getBoundingClientRect();
    const targetRect = targetElement.getBoundingClientRect();

    return !(
      draggedRect.right < targetRect.left ||
      draggedRect.left > targetRect.right ||
      draggedRect.bottom < targetRect.top ||
      draggedRect.top > targetRect.bottom
    );
  }

  /**
   * Método drop para manipular a lógica de drag-and-drop
   * @param event CdkDragDrop<any>
   */
  drop(event: CdkDragDrop<any>): void {
    const previousContainer = event.previousContainer;
    const currentContainer = event.container;
    const draggedDocument: Document = event.item.data;

    console.log('Evento de Drop:', event);

    // Se o container de origem e destino forem os mesmos, não faz nada
    if (previousContainer === currentContainer) {
      return;
    }

    // Verifica se o container de destino tem um ID que corresponde a uma pasta
    const targetFolderId = currentContainer.id; // Assumindo que o ID do container é o ID da pasta

    // Verifica se o ID do container de destino é 'documentsList' ou um ID de pasta válido
    if (targetFolderId === 'documentsList') {
      // Caso 'documentsList' seja uma lista global ou uma área específica
      // Implemente a lógica conforme necessário
      console.warn('Documento solto em uma área inválida: documentsList');
      return;
    }

    // Verifica se a pasta de destino existe
    const targetFolder = this.folderService.getFolderById(targetFolderId);
    if (!targetFolder) {
      console.error(`Pasta de destino com ID ${targetFolderId} não encontrada.`);
      return;
    }

    // Mover o documento para a pasta de destino
    this.documentService.moveDocumentToFolder(draggedDocument.id, targetFolderId);

    // Atualizar a pasta atual para refletir a mudança
    this.updateCurrentFolder(this.currentFolder.id);
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
