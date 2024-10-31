// src/app/services/folder.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Folder } from '../models/folder.model';

@Injectable({
  providedIn: 'root',
})
export class FolderService {
  private folders: Folder[] = [
    {
      id: 'root',
      name: 'Raiz',
      children: [],
      documents: [],
    },
  ];

  private foldersSubject: BehaviorSubject<Folder[]> = new BehaviorSubject<Folder[]>(this.folders);
  folders$: Observable<Folder[]> = this.foldersSubject.asObservable();

  constructor() {}

  /**
   * Obtém todas as pastas.
   * @returns Folder[]
   */
  getFolders(): Folder[] {
    return this.folders;
  }

  /**
   * Obtém uma pasta pelo ID.
   * @param id string
   * @returns Folder | undefined
   */
  getFolderById(id: string): Folder | undefined {
    return this.findFolderRecursive(this.folders, id);
  }

  /**
   * Cria uma nova pasta dentro de uma pasta existente.
   * @param name string - Nome da nova pasta
   * @param parentId string - ID da pasta pai
   * @returns Folder | undefined
   */

  createFolder(name: string, parentId: string): Folder | undefined {
    const parentFolder = this.getFolderById(parentId);
    if (parentFolder) {
      const newFolder: Folder = {
        id: this.generateId(),
        name,
        parentId, // Atribuindo 'parentId'
        children: [],
        documents: [], // Inicializando 'documents' como um array vazio
      };
      parentFolder.children.push(newFolder);
      this.foldersSubject.next(this.folders);
      console.log(`Pasta criada:`, newFolder); // Log para depuração
      return newFolder;
    }
    console.error(`Pasta pai com ID ${parentId} não encontrada.`);
    return undefined;
  }

  /**
   * Move uma pasta para outra pasta.
   * @param folderId string - ID da pasta a ser movida
   * @param targetFolderId string - ID da pasta de destino
   * @returns boolean - Indica se a operação foi bem-sucedida
   */
  moveFolder(folderId: string, targetFolderId: string): boolean {
    if (folderId === 'root') {
      console.error('Não é possível mover a pasta raiz.');
      return false;
    }

    const folderToMove = this.getFolderById(folderId);
    const targetFolder = this.getFolderById(targetFolderId);

    if (!folderToMove) {
      console.error(`Pasta com ID ${folderId} não encontrada.`);
      return false;
    }

    if (!targetFolder) {
      console.error(`Pasta de destino com ID ${targetFolderId} não encontrada.`);
      return false;
    }

    // Encontra e remove a pasta do local atual
    const parentFolder = this.findParentFolder(this.folders, folderId);
    if (parentFolder) {
      parentFolder.children = parentFolder.children.filter(folder => folder.id !== folderId);
    }

    // Adiciona a pasta ao novo destino
    targetFolder.children.push(folderToMove);

    // Atualiza o 'parentId' da pasta movida
    folderToMove.parentId = targetFolderId;

    this.foldersSubject.next(this.folders);
    console.log(`Pasta "${folderToMove.name}" movida para a pasta "${targetFolder.name}".`);
    return true;
  }

  /**
   * Exclui uma pasta pelo ID.
   * @param folderId string
   * @returns boolean - Indica se a operação foi bem-sucedida
   */
  deleteFolder(folderId: string): boolean {
    if (folderId === 'root') {
      console.error('Não é possível excluir a pasta raiz.');
      return false;
    }

    const parentFolder = this.findParentFolder(this.folders, folderId);
    if (parentFolder) {
      parentFolder.children = parentFolder.children.filter(folder => folder.id !== folderId);
      this.foldersSubject.next(this.folders);
      return true;
    } else {
      console.error(`Pasta com ID ${folderId} não encontrada.`);
      return false;
    }
  }

  /**
   * Método recursivo para encontrar uma pasta pelo ID.
   * @param folders Folder[] - Lista de pastas
   * @param id string - ID da pasta
   * @returns Folder | undefined
   */
  private findFolderRecursive(folders: Folder[], id: string): Folder | undefined {
    for (const folder of folders) {
      if (folder.id === id) {
        return folder;
      }
      const found = this.findFolderRecursive(folder.children, id);
      if (found) {
        return found;
      }
    }
    return undefined;
  }

  /**
   * Encontra a pasta pai de uma pasta específica.
   * @param folders Folder[] - Lista de pastas
   * @param childId string - ID da pasta filha
   * @returns Folder | undefined
   */
  private findParentFolder(folders: Folder[], childId: string): Folder | undefined {
    for (const folder of folders) {
      if (folder.children.some(child => child.id === childId)) {
        return folder;
      }
      const found = this.findParentFolder(folder.children, childId);
      if (found) {
        return found;
      }
    }
    return undefined;
  }

  /**
   * Gera um ID único.
   * @returns string
   */
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
