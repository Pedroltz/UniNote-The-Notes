// src/app/components/new-document-dialog/new-document-dialog.component.ts

import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-new-document-dialog',
  templateUrl: './new-document-dialog.component.html',
  styleUrls: ['./new-document-dialog.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
})
export class NewDocumentDialogComponent {
  documentName: string = '';
  documentConteudo: string = '';

  constructor(public dialogRef: MatDialogRef<NewDocumentDialogComponent>) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onCreate(): void {
    console.log('Dados do novo documento:', {
      name: this.documentName,
      content: this.documentConteudo,
    });
    this.dialogRef.close({ name: this.documentName, content: this.documentConteudo });
  }
}
