// src/app/components/sidebar/sidebar.component.ts

import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FolderService } from '../../services/folder.service';
import { MatListModule } from '@angular/material/list';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFolder } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common'; // Import necessário

interface FolderNode {
  name: string;
  id: string;
  children?: FolderNode[];
}

interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
  id: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,         // Adicionado
    MatListModule,
    MatTreeModule,
    MatIconModule,
    FontAwesomeModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @Output() folderSelected = new EventEmitter<void>();

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level,
    node => node.expandable
  );

  treeFlattener: MatTreeFlattener<FolderNode, ExampleFlatNode>;

  dataSource: MatTreeFlatDataSource<FolderNode, ExampleFlatNode>;

  constructor(
    private router: Router,
    private folderService: FolderService,
    private library: FaIconLibrary
  ) {
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      node => node.level,
      node => node.expandable,
      node => node.children
    );

    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    // Adicionar o ícone à biblioteca
    library.addIcons(faFolder);
  }

  ngOnInit(): void {
    const rootFolder = this.folderService.getFolderById('root');
    if (rootFolder) {
      const data = this.buildFolderTree(rootFolder);
      this.dataSource.data = [data]; // Incluir "Meus Arquivos" como raiz
    }
  }

  transformer = (node: FolderNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      id: node.id
    };
  };

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  navigateToFolder(id: string) {
    this.router.navigate(['/folder', id]);
    this.folderSelected.emit();
  }

  private buildFolderTree(folder: any): FolderNode {
    return {
      name: folder.name,
      id: folder.id,
      children: folder.children.map((child: any) => this.buildFolderTree(child))
    };
  }
}
