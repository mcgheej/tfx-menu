import { OverlayRef } from '@angular/cdk/overlay';
import { Observable, Subject } from 'rxjs';

export class PopupRef<T> {
  private resultSubject$ = new Subject<T>();
  private result$ = this.resultSubject$.asObservable();

  constructor(private overlayRef: OverlayRef) {}

  closeWithResult(result: T): void {
    this.resultSubject$.next(result);
    this.close();
  }

  close(): void {
    this.overlayRef.dispose();
    this.resultSubject$.complete();
  }

  afterClosed(): Observable<T> {
    return this.result$;
  }
}
