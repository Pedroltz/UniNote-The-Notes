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
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

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
    MatMenuModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './folder-view.component.html',
  styleUrls: ['./folder-view.component.css'],
})
export class FolderViewComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  @ViewChild('targetItem') targetItem!: ElementRef;

  // Start with currentFolder as Folder | undefined
  currentFolder: Folder = {
    id: '',
    name: '',
    children: [],
    documents: [{ id: 'ewhw76b', name: 'test', content: '', folderId: 'root' }],
  };
  folderDropListIds: string[] = [];
  sidebarOpened = false;

  textSize = 14;

  private folderSubscription!: Subscription;
  private routeSubscription!: Subscription;

  selectedFolder: Folder | undefined;
  selectedDocument: Document | undefined;

  folderListVisible: boolean = false;
  optionsMenuVisible: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private folderService: FolderService,
    private documentService: DocumentService,
    private library: FaIconLibrary,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    library.addIcons(faFolder, faFileAlt);
  }

  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap.subscribe((params) => {
      const folderId = params.get('id')!;
      this.updateCurrentFolder(folderId);
    });

    this.folderSubscription = this.folderService.folders$.subscribe(() => {
      if (this.currentFolder) {
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

  private updateCurrentFolder(folderId: string): void {
    const folder = this.folderService.getFolderById(folderId);
    if (!folder) {
      this.router.navigate(['/folder', 'root']);
      return;
    }

    this.currentFolder = folder;
    console.log(`Pasta atual:`, this.currentFolder); // Log para depuração

    // Use non-null assertion operator since we know currentFolder is not undefined here
    this.folderDropListIds = this.currentFolder!.children.map((folder) => folder.id);
    this.folderDropListIds.push('documentsList');
  }

  openFolder(id: string): void {
    this.router.navigate(['/folder', id]);
  }

  openDocument(id: string): void {
    this.router.navigate(['/document', id]);
  }

  openNewFolderDialog(): void {
    if (!this.currentFolder) return;
    const dialogRef = this.dialog.open(NewFolderDialogComponent, {
      width: '350px',
      backdropClass: 'custom-dialog-backdrop',
      panelClass: 'custom-dialog-panel',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && this.currentFolder) {
        const newFolder = this.folderService.createFolder(result, this.currentFolder.id);
        if (newFolder) {
          console.log(
            `Pasta "${newFolder.name}" criada com sucesso na pasta "${this.currentFolder.name}".`
          );
        }
      }
    });
  }

  createNewDocument(): void {
    if (!this.currentFolder) return;
    const dialogRef = this.dialog.open(NewDocumentDialogComponent, {
      width: '350px',
      backdropClass: 'custom-dialog-backdrop',
      panelClass: 'custom-dialog-panel',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && this.currentFolder) {
        const newDocument = this.documentService.createDocument(
          result,
          this.currentFolder.id,
        );
        if (newDocument) {
          console.log(
            `Documento "${newDocument.name}" criado com sucesso na pasta "${this.currentFolder.name}".`
          );
          console.log(this.currentFolder.documents, "\n", this.currentFolder.children);
        }
      }
    });
  }

  onDrag(event: CdkDragMove): void {
    const draggedElement = event.source.element.nativeElement;
    if (!this.targetItem) return;
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
   * Método para manipular o evento de drop em pastas.
   * @param event CdkDragDrop<any>
   */
  dropFolder(event: CdkDragDrop<any>): void {
    if (!this.currentFolder) return;

    const draggedDocument: Document = event.item.data;
    const targetFolderId: string = event.container.data;

    console.log(`Tentando mover o documento "${draggedDocument.name}" para a pasta com ID "${targetFolderId}"`);

    // Verifique se o documento já está na pasta de destino
    if (draggedDocument.folderId === targetFolderId) {
      console.warn('O documento já está na pasta de destino.');
      return;
    }

    // Mover o documento para a pasta de destino
    const moved: boolean = this.documentService.moveDocumentToFolder(draggedDocument.id, targetFolderId);
    if (moved) {
      console.log(`Documento "${draggedDocument.name}" movido com sucesso para a pasta com ID "${targetFolderId}".`);
    } else {
      console.error(`Falha ao mover o documento "${draggedDocument.name}" para a pasta com ID "${targetFolderId}".`);
    }

    // Atualizar a pasta atual para refletir a mudança
    this.updateCurrentFolder(this.currentFolder.id);
  }

  drop(event: CdkDragDrop<any>): void {
    console.log('Documento solto na lista global.');
  }

  toggleSidebar(): void {
    this.sidebarOpened = !this.sidebarOpened;
  }

  onSidebarClosed(): void {
    this.sidebarOpened = false;
  }

  onFolderSelected(): void {
    this.sidenav.close();
    this.sidebarOpened = false;
  }

  /**
   * Define a pasta selecionada ao abrir o menu.
   * @param folder Folder
   */
  setSelectedFolder(folder: Folder): void {
    this.selectedFolder = folder;
  }

  /**
   * Define o documento selecionado ao abrir o menu.
   * @param doc Document
   */
  setSelectedDocument(doc: Document): void {
    this.selectedDocument = doc;
  }

  /**
   * Exclui a pasta selecionada após confirmação.
   */
  deleteSelectedFolder(): void {
    if (!this.selectedFolder) return;
    const folder = this.selectedFolder;
    const confirmed = confirm(`Tem certeza de que deseja excluir a pasta "${folder.name}"?`);
    if (confirmed) {
      const deleted = this.folderService.deleteFolder(folder.id);
      if (deleted && this.currentFolder) {
        this.updateCurrentFolder(this.currentFolder.id);
        this.snackBar.open(`Pasta "${folder.name}" excluída com sucesso.`, 'Fechar', {
          duration: 3000,
        });
      } else {
        this.snackBar.open(`Falha ao excluir a pasta "${folder.name}".`, 'Fechar', {
          duration: 3000,
        });
      }
    }
  }

  /**
   * Exclui o documento selecionado após confirmação.
   */
  deleteSelectedDocument(): void {
    if (!this.selectedDocument) return;
    const doc = this.selectedDocument;
    const confirmed = confirm(`Tem certeza de que deseja excluir o documento "${doc.name}"?`);
    if (confirmed) {
      const deleted = this.documentService.deleteDocument(doc.id);
      if (deleted && this.currentFolder) {
        this.updateCurrentFolder(this.currentFolder.id);
        this.snackBar.open(`Documento "${doc.name}" excluído com sucesso.`, 'Fechar', {
          duration: 3000,
        });
      } else {
        this.snackBar.open(`Falha ao excluir o documento "${doc.name}".`, 'Fechar', {
          duration: 3000,
        });
      }
    }
  }
  toggleMoveFolderList(): void {
    this.folderListVisible = !this.folderListVisible;
  }
  toggleOptionsMenuList(): void {
    this.optionsMenuVisible = !this.optionsMenuVisible;
  }
  changeFolder(docId:string, folderId:string) {
    this.documentService.moveDocumentToFolder(docId,folderId);
    this.toggleMoveFolderList()
    this.toggleOptionsMenuList()
  }
}
