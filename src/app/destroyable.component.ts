import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs';

@Component({
  template:''
})
export class DestroyableComponent implements OnDestroy {
  protected unsubscriber$ = new Subject<void>(); 

  protected unsubscribeOnDestroy<T>(source:Observable<T>):Observable<T>{
    return source.pipe(takeUntil(this.unsubscriber$));
  }

  ngOnDestroy(): void {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }
}