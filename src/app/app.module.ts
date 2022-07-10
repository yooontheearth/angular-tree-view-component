import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { TreeListComponent } from './tree-list/tree-list.component';
import { TreeItemComponent } from './tree-item/tree-item.component';

@NgModule({
  declarations: [
    AppComponent,
    TreeListComponent,
    TreeItemComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
