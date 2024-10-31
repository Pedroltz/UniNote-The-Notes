// src/app/models/folder.model.ts
import { Document } from './document.model';

export interface Folder {
  id: string;
  name: string;
  parentId?: string;
  children: Folder[];
  documents: Document[]; // Certifique-se de que 'documents' não é opcional
}
