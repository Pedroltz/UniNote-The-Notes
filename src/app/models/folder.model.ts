import { Document } from './document.model';

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  children: Folder[];
  documents: Document[];
}
