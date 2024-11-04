import { Document } from './document.model';

export interface Folder {
  id: string;
  name: string;
  parentId?: string;
  children: Folder[];
  documents: Document[]; 
}
