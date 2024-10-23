import { Injectable } from '@angular/core';
import { Folder } from '../models/folder.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FolderService {
  private folders: Folder[] = [];

  private foldersSubject = new BehaviorSubject<Folder[]>([]);
  folders$ = this.foldersSubject.asObservable();

  constructor() {
    const rootFolder: Folder = {
      id: 'root',
      name: 'Meus Arquivos',
      parentId: null,
      children: [],
      documents: []
    };
    this.folders.push(rootFolder);
    this.foldersSubject.next(this.folders);
  }

  getFolderById(id: string): Folder | undefined {
    return this.findFolder(this.folders, id);
  }

  private findFolder(folders: Folder[], id: string): Folder | undefined {
    for (const folder of folders) {
      if (folder.id === id) return folder;
      const found = this.findFolder(folder.children, id);
      if (found) return found;
    }
    return undefined;
  }

  createFolder(name: string, parentId: string): Folder {
    const parentFolder = this.getFolderById(parentId);
    if (!parentFolder) throw new Error('Pasta pai não encontrada');

    const newFolder: Folder = {
      id: this.generateId(),
      name,
      parentId,
      children: [],
      documents: []
    };

    parentFolder.children.push(newFolder);
    this.foldersSubject.next(this.folders); // Notificar os assinantes sobre a mudança
    return newFolder;
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 9);
  }
}
