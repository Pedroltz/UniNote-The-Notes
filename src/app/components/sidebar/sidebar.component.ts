import { Component, OnInit, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { FolderService } from '../../services/folder.service';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { FlatTreeControl } from '@angular/cdk/tree';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFolder } from '@fortawesome/free-solid-svg-icons';
import { BehaviorSubject, Observable } from 'rxjs';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';

interface FolderNode {
  name: string;
  id: string;
  children?: FolderNode[];
}

interface FlatFolderNode {
  expandable: boolean;
  name: string;
  level: number;
  id: string;
}

class CustomTreeDataSource implements DataSource<FlatFolderNode> {
  private dataChange = new BehaviorSubject<FlatFolderNode[]>([]);

  constructor(private treeControl: FlatTreeControl<FlatFolderNode>) {}

  connect(collectionViewer: CollectionViewer): Observable<FlatFolderNode[]> {
    return this.dataChange.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.dataChange.complete();
  }

  setData(data: FlatFolderNode[]): void {
    this.dataChange.next(data);
  }
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatTreeModule,
    MatIconModule,
    FontAwesomeModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent implements OnInit {
  @Output() folderSelected = new EventEmitter<void>();

  readonly treeControl = new FlatTreeControl<FlatFolderNode>(
    node => node.level,
    node => node.expandable
  );

  readonly dataSource = new CustomTreeDataSource(this.treeControl);

  constructor(
    private readonly router: Router,
    private readonly folderService: FolderService,
    private readonly library: FaIconLibrary
  ) {
    this.library.addIcons(faFolder);
  }

  ngOnInit(): void {
    const rootFolder = this.folderService.getFolderById('root');
    if (rootFolder) {
      const data = this.buildFolderTree(rootFolder);
      this.dataSource.setData(data);
    }
  }

  private transformer = (node: FolderNode, level: number): FlatFolderNode => ({
    expandable: !!node.children && node.children.length > 0,
    name: node.name,
    level,
    id: node.id
  });

  hasChild = (_: number, node: FlatFolderNode): boolean => node.expandable;

  navigateToFolder(id: string): void {
    this.router.navigate(['/folder', id]);
    this.folderSelected.emit();
  }

  private buildFolderTree(folder: FolderNode, level: number = 0): FlatFolderNode[] {
    const flatNode = this.transformer(folder, level);
    let nodes: FlatFolderNode[] = [flatNode];

    if (folder.children) {
      folder.children.forEach(child => {
        nodes = nodes.concat(this.buildFolderTree(child, level + 1));
      });
    }

    return nodes;
  }
}
