import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Directory } from './directory'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'tree-app';

  private directories:Directory[] = [
    { name:'Directory1', id:1, parentId:null },
    { name:'Directory2', id:2, parentId:null },
    { name:'Directory1-1', id:3, parentId:1 },
    { name:'Directory1-2', id:4, parentId:1 },
    { name:'Directory2-1', id:5, parentId:2 },
    { name:'Directory1-2-1', id:6, parentId:4 },
    { name:'Directory3', id:7, parentId:null },
    { name:'Directory1-2-2', id:8, parentId:4 },
    { name:'Directory1-2-3', id:9, parentId:4 },
    { name:'Directory2-2', id:10, parentId:2 },
  ];

  directoryData$ = new BehaviorSubject<Directory[]>(this.directories);
  selectedDirectories:Directory[] = [];

  generateDirectories():void{
    const max = 10;
    const min = 5;
    const count = Math.ceil(Math.random() * (max - min) + min);
    
    this.directories = [];
    // TODO : make a random parent-child relationship
    [...Array(count)].map((_,i) => this.directories.push({ name:`Directory${i}`, id:i, parentId:null }));
    this.directoryData$.next(this.directories);
  }

  onChangeSelections(selectedDirectories:Directory[]){
    this.selectedDirectories = selectedDirectories;
  }
}
