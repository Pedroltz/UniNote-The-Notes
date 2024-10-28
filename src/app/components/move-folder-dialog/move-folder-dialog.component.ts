import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FolderService } from '../../services/folder.service';
import { Folder } from '../../models/folder.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-move-document-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSelectModule, MatButtonModule],
  template: `
    <h1 mat-dialog-title>Mover Documento</h1>
    <div mat-dialog-content>
      <mat-form-field appearance="fill" style="width: 100%;">
        <mat-label>Selecionar Pasta de Destino</mat-label>
        <mat-select [(value)]="selectedFolderId">
          <mat-option *ngFor="let folder of availableFolders" [value]="folder.id">
            {{ folder.name }}
          </mat-option>
        </mat-select>
      </mat-form-field>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-button color="primary" [disabled]="!selectedFolderId" (click)="onMove()">Mover</button>
    </div>
  `,
  styles: []
})
export class MoveDocumentDialogComponent implements OnInit {
  availableFolders: Folder[] = [];
  selectedFolderId: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<MoveDocumentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { documentId: string },
    private folderService: FolderService
  ) {}

  ngOnInit(): void {
    this.availableFolders = this.folderService.getAllFolders();
  }

  onMove(): void {
    this.dialogRef.close(this.selectedFolderId);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
