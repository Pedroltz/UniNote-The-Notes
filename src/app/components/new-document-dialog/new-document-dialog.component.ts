// src/app/components/new-document-dialog/new-document-dialog.component.ts

import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field'; // Importação necessária
import { MatInputModule } from '@angular/material/input'; // Importação necessária
import { MatButtonModule } from '@angular/material/button'; // Importação necessária

@Component({
  selector: 'app-new-document-dialog',
  templateUrl: './new-document-dialog.component.html',
  styleUrls: ['./new-document-dialog.component.css'],
  standalone: true,
  imports: [
    MatDialogModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
})
export class NewDocumentDialogComponent {
  documentName: string = '';
}
