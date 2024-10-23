// src/app/services/document.service.ts

import { Injectable } from '@angular/core';
import { Document } from '../models/document.model';
import { FolderService } from './folder.service';
import { Folder } from '../models/folder.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  constructor(private folderService: FolderService) {}

  /** Método para criar um novo documento */
  createDocument(name: string, folderId: string): Document {
    const folder = this.folderService.getFolderById(folderId);
    if (!folder) throw new Error('Pasta não encontrada');

    const newDocument: Document = {
      id: this.generateId(),
      name,
      content: '',
      folderId
    };

    folder.documents.push(newDocument);
    return newDocument;
  }

  /** Método para obter um documento pelo ID */
  getDocumentById(id: string): Document | undefined {
    const rootFolder = this.folderService.getFolderById('root');
    if (rootFolder) {
      return this.findDocument(rootFolder, id);
    }
    return undefined;
  }

  /** Método recursivo para encontrar um documento em todas as pastas */
  private findDocument(folder: Folder, id: string): Document | undefined {
    // Verifica se o documento está na pasta atual
    const doc = folder.documents.find(d => d.id === id);
    if (doc) return doc;

    // Procura recursivamente nas subpastas
    for (const childFolder of folder.children) {
      const found = this.findDocument(childFolder, id);
      if (found) return found;
    }
    return undefined;
  }

  /** Método para mover um documento para outra pasta */
  moveDocumentToFolder(documentId: string, targetFolderId: string): void {
    const document = this.getDocumentById(documentId);
    if (!document) throw new Error('Documento não encontrado');

    const currentFolder = this.folderService.getFolderById(document.folderId);
    const targetFolder = this.folderService.getFolderById(targetFolderId);

    if (!currentFolder || !targetFolder) throw new Error('Pasta não encontrada');

    // Remove o documento da pasta atual
    currentFolder.documents = currentFolder.documents.filter(doc => doc.id !== documentId);

    // Atualiza o folderId do documento
    document.folderId = targetFolderId;

    // Adiciona o documento na pasta de destino
    targetFolder.documents.push(document);
  }

  /** Método para gerar IDs únicos */
  private generateId(): string {
    return Math.random().toString(36).substring(2, 9);
  }
}
