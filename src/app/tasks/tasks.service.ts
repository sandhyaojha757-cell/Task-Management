import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Task } from './task.model';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap, debounceTime } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TasksService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  private readonly _tasks$ = new BehaviorSubject<Task[]>([]);
  readonly tasks$ = this._tasks$.asObservable();

  private readonly _search = signal<string>('');
  private readonly _status = signal<string>('');
  private readonly _priority = signal<string>('');

  readonly filter$ = new BehaviorSubject({ search: '', status: '', priority: '' });

  constructor() {
    // react to filter changes with debounce
    this.filter$
      .pipe(
        debounceTime(250),
        switchMap((f) => this.fetchTasks(f.search, f.status, f.priority))
      )
      .subscribe();
  }

  init(): void {
    this.fetchTasks().subscribe();
  }

  setSearch(search: string) {
    this.filter$.next({ ...this.filter$.value, search });
  }

  setStatus(status: string) {
    this.filter$.next({ ...this.filter$.value, status });
  }

  setPriority(priority: string) {
    this.filter$.next({ ...this.filter$.value, priority });
  }

  fetchTasks(search = '', status = '', priority = ''): Observable<Task[]> {
    let params = new HttpParams();
    if (search) params = params.set('title_like', search);
    if (status) params = params.set('status', status);
    if (priority) params = params.set('priority', priority);
    return this.http.get<Task[]>(this.baseUrl, { params }).pipe(
      tap((tasks) => this._tasks$.next(tasks)),
      catchError(() => {
        this._tasks$.next([]);
        return of([]);
      })
    );
  }

  getTask(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.baseUrl}/${id}`);
  }

  addTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.baseUrl, task).pipe(
      tap(() => this.fetchTasks().subscribe())
    );
  }

  updateTask(id: string, task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.baseUrl}/${id}`, task).pipe(
      tap(() => this.fetchTasks().subscribe())
    );
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      tap(() => this.fetchTasks().subscribe())
    );
  }
}
