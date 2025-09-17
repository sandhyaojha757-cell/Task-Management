import { Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private _count = signal<number>(0);
  readonly loading$ = toObservable(this._count).pipe(map((c: number) => c > 0));

  show(): void {
    this._count.update((c) => c + 1);
  }

  hide(): void {
    this._count.update((c) => Math.max(0, c - 1));
  }
}
