import { Component, OnInit, Input, OnChanges, SimpleChanges, ɵɵsetComponentScope } from '@angular/core';
import { TreeDataService } from '../tree-data.service';
import { TreeDirectory } from '../directory';
import { DestroyableComponent } from '../destroyable.component';

@Component({
  selector: 'app-tree-item',
  templateUrl: './tree-item.component.html',
  styleUrls: ['./tree-item.component.css']
})
export class TreeItemComponent extends DestroyableComponent implements OnInit, OnChanges {
  constructor(public treeDataService:TreeDataService ) {
    super();
   }

  @Input() item!:TreeDirectory;
  isClose = false;
  isSelected = false;

  ngOnInit(): void {
    console.log(`tree-item created`);

    this.treeDataService.selections$
        .pipe((d) => this.unsubscribeOnDestroy(d))
        .subscribe(selections => {
          console.log(`tree-item selections gets updated`);
          if(!selections){
            this.isSelected = false;
            return;
          }
          this.isSelected = selections.some(s => s == this.item);
        });
  }

  getElementId(){
    return `tree-item-${this.item.id}`;
  }

  toggleVisibility():void{
    this.isClose = !this.isClose;
  }

  onSelect(event:MouseEvent):void{
    this.treeDataService.setSelection(this.item, event.ctrlKey);
  }

  ngOnChanges(changes: SimpleChanges): void {
    for(const propName in changes){
      console.log(`tree-item ${propName} gets updated in ngOnChanges`);
    }
  } 

  // Drag & Drop events
  onDragStart(event:DragEvent ) { 
    if(event.dataTransfer){
      event.dataTransfer.effectAllowed = "move";

      const selections = this.treeDataService.selections.map(s => s.id);
      if(!selections.includes(this.item.id)){
        selections.push(this.item.id);
      }

      const data = JSON.stringify(selections);
      event.dataTransfer.setData("application/json", data);

      this.setDragImage(event);
    }
  }

  private setDragImage(event:DragEvent) {
    // TODO : multiple elements if the multiple directories are selected, ...it seems to be impossible in this way though
    const elem = document.getElementById(this.getElementId());
    if(elem)
      event.dataTransfer?.setDragImage(elem, -20, -20);
  }
  
  onDragEnter(event:DragEvent ) {    
    const target = event.target as HTMLDivElement;
    if(target){
      target.classList.add('hovering');   // TODO : a class name should be more specific for this component since it's in a global scope
    }
    event.preventDefault();
  }

  onDragOver(event:DragEvent ) {
    event.preventDefault();   // To process the drop event, needs to call this.
  }

  onDragLeave(event:DragEvent ) {
    const target = event.target as HTMLDivElement;
    if(target){
      target.classList.remove('hovering');
    }
  }

  private isDroppable(children:number[]):boolean{
    // Can't set myself as my parent 
    // TODO : can't set my ancestor as my parent
    if(children.includes(this.item.id)){
      return false;
    }
    return true;
  }
  
  onDrop(event:DragEvent ) {
    this.endDragging();    

    const data = event.dataTransfer?.getData("application/json");
    if(data){
      const children = JSON.parse(data); 
      if(!this.isDroppable(children)){
        return false;
      }
      console.log(`me:${this.item.id} children:${children}`);
      this.treeDataService.treeData.filter(d => children.includes(d.id)).forEach(d => d.parentId = this.item.id);
      this.treeDataService.refreshTree();
      this.treeDataService.clearSelection();
    }
    return true;
  }

  onDragEnd(event:DragEvent ) {
    this.endDragging();
  }

  private endDragging(){
    let hoverings = document.getElementsByClassName('hovering');
    while (hoverings.length > 0) {
      hoverings[0].classList.remove('hovering');
    }
  }
}
