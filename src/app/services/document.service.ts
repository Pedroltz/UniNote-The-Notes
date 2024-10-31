// src/app/services/document.service.ts

import { Injectable } from '@angular/core';
import { Document } from '../models/document.model';
import { FolderService } from './folder.service';
import { Folder } from '../models/folder.model';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  private documents: Document[] = [];

  constructor(private folderService: FolderService) {}

  /**
   * Gera um ID único para um documento.
   * @returns string
   */
  private generateId(): string {
    return Math.random().toString(36).substring(2, 9);
  }

  /**
   * Cria um novo documento e o associa à pasta especificada.
   * @param name string - Nome do documento
   * @param folderId string - ID da pasta onde o documento será criado
   * @param content string - Conteúdo do documento
   * @returns Document | undefined
   */
  createDocument(name: string, folderId: string): Document | undefined {
    // Verifica se a pasta existe
    const folder = this.folderService.getFolderById(folderId);
    if (!folder) {
      console.error(`Pasta com ID "${folderId}" não encontrada. Não foi possível criar o documento.`);
      return undefined;
    }

    // Cria o novo documento
    const newDocument: Document = {
      id: this.generateId(),
      name: name,
      content: "",
      folderId: folderId,
    };

    // Adiciona o documento à lista global de documentos
    this.documents.push(newDocument);

    // Adiciona o documento à pasta correspondente
    folder.documents.push(newDocument);

    console.log('Documento criado:', newDocument);
    return newDocument;
  }

  /**
   * Obtém todos os documentos.
   * @returns Document[]
   */
  getDocuments(): Document[] {
    return this.documents;
  }

  /**
   * Obtém um documento pelo ID.
   * @param id string
   * @returns Document | undefined
   */
  getDocumentById(id: string): Document | undefined {
    return this.documents.find((doc) => doc.id === id);
  }

  /**
   * Move um documento para outra pasta.
   * @param documentId string - ID do documento a ser movido
   * @param targetFolderId string - ID da pasta de destino
   * @returns boolean - True se o documento foi movido com sucesso, false caso contrário
   */
  moveDocumentToFolder(documentId: string, targetFolderId: string): boolean {
    const document = this.getDocumentById(documentId);
    const targetFolder = this.folderService.getFolderById(targetFolderId);

    if (!document) {
      console.error(`Documento com ID "${documentId}" não encontrado.`);
      return false;
    }

    if (!targetFolder) {
      console.error(`Pasta de destino com ID "${targetFolderId}" não encontrada.`);
      return false;
    }

    // Remove o documento da pasta atual
    const currentFolder = this.folderService.getFolderById(document.folderId);
    if (currentFolder) {
      currentFolder.documents = currentFolder.documents.filter((doc) => doc.id !== documentId);
    } else {
      console.warn(`Pasta atual com ID "${document.folderId}" não encontrada.`);
    }

    // Atualiza o folderId do documento
    document.folderId = targetFolderId;

    // Adiciona o documento à pasta de destino
    targetFolder.documents.push(document);

    console.log(`Documento "${document.name}" movido para a pasta "${targetFolder.name}".`);
    return true;
  }

  /**
   * Exclui um documento pelo ID.
   * @param id string - ID do documento a ser excluído
   * @returns boolean - True se o documento foi excluído com sucesso, false caso contrário
   */
  deleteDocument(id: string): boolean {
    const documentIndex = this.documents.findIndex((doc) => doc.id === id);
    if (documentIndex === -1) {
      console.error(`Documento com ID "${id}" não encontrado.`);
      return false;
    }

    const document = this.documents[documentIndex];

    // Remove o documento da pasta associada
    const folder = this.folderService.getFolderById(document.folderId);
    if (folder) {
      folder.documents = folder.documents.filter((doc) => doc.id !== id);
    } else {
      console.warn(`Pasta com ID "${document.folderId}" não encontrada ao tentar remover o documento.`);
    }

    // Remove o documento da lista global
    this.documents.splice(documentIndex, 1);

    console.log(`Documento "${document.name}" excluído com sucesso.`);
    return true;
  }
}
