import { BehaviorSubject } from 'rxjs';
import { Directory, TreeDirectory } from './directory';

export class TreeDataService {
  constructor() { }

  treeData:TreeDirectory[] = [];
  selections:TreeDirectory[] = [];

  selections$ = new BehaviorSubject<TreeDirectory[]>([]);
  rootDirectories$ = new BehaviorSubject<TreeDirectory[]>([]);

  setData(treeData:Directory[] | null){
    if(!treeData)
      treeData = [];

    this.treeData = [...treeData.map((o, i) => Object.assign({}, o) as TreeDirectory)];
    this.refreshTree();

    this.selections = [];
    this.selections$.next(this.selections);
  }

  refreshTree(){
    this.refreshChildren();
    this.rootDirectories$.next(this.getRootData());
  }

  private refreshChildren(){
    this.treeData.forEach(t => t.children = this.getChildrenOf(t.id));
  }

  private getRootData():TreeDirectory[]{
    console.log(`getRootData`);
    return this.treeData.filter(t => !t.parentId);
  }

  private getChildrenOf(id:number):TreeDirectory[]{
    console.log(`getChildrenOf ${id}`);
    return this.treeData.filter(t => t.parentId === id);
  }

  setSelection(item:TreeDirectory, control:boolean):void{
    if(control){
      if(this.selections.includes(item)){
        this.selections = this.selections.filter(s => s !== item)
      }
      else{
        this.selections.push(item);
      }
    }
    else if(item){
      this.selections = [item];
    }
    this.selections$.next(this.selections);
  }

  clearSelection(){
    this.selections = [];
    this.selections$.next(this.selections);
  }
}
