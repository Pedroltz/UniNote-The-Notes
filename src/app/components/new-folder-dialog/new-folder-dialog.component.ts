// src/app/components/new-folder-dialog/new-folder-dialog.component.ts

import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field'; // Importação necessária
import { MatInputModule } from '@angular/material/input'; // Importação necessária
import { MatButtonModule } from '@angular/material/button'; // Importação necessária

@Component({
  selector: 'app-new-folder-dialog',
  templateUrl: './new-folder-dialog.component.html',
  styleUrls: ['./new-folder-dialog.component.css'],
  standalone: true,
  imports: [
    MatDialogModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
})
export class NewFolderDialogComponent {
  folderName: string = '';
}
