import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { TreeDataService } from '../tree-data.service';
import { Directory, TreeDirectory } from '../directory';
import { DestroyableComponent } from '../destroyable.component';

@Component({
  selector: 'app-tree-list',
  templateUrl: './tree-list.component.html',
  styleUrls: ['./tree-list.component.css'],
  providers:[ TreeDataService ]
})
export class TreeListComponent extends DestroyableComponent implements OnInit, OnChanges {
  constructor(public treeDataService:TreeDataService ) { 
    super();
  }

  @Input() treeData!:Directory[] | null;
  rootDirectories:TreeDirectory[] = [];

  @Output() changeSelections: EventEmitter<Directory[]> = new EventEmitter();

  ngOnInit(): void {
    console.log(`tree-list created`);

    this.treeDataService.rootDirectories$
        .pipe((d) => this.unsubscribeOnDestroy(d))
        .subscribe(rootDirectories => {
          console.log('tree-list root gets updated');
          this.rootDirectories = rootDirectories;
        });

    this.treeDataService.selections$
        .pipe((d) => this.unsubscribeOnDestroy(d))
        .subscribe(selections => {
          this.changeSelections.emit(selections);
        });
  }

  ngOnChanges(changes: SimpleChanges): void {
    for(const propName in changes){
      console.log(`tree-list ${propName} gets updated in ngOnChanges`);
    }

    if(changes['treeData']){
      this.treeDataService.setData(this.treeData); 
    }
  } 
}
