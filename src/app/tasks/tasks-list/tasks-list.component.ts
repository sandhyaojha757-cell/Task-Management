import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, OnInit, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../../core/confirm-dialog/confirm-dialog.component';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { TasksService } from '../tasks.service';
import { Task } from '../task.model';
import { IsOverduePipe } from '../../shared/pipes/is-overdue.pipe';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-tasks-list',
  standalone: true,
  imports: [
    AsyncPipe,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatDialogModule,
    ReactiveFormsModule,
    IsOverduePipe,
    CommonModule
  ],
  templateUrl: './tasks-list.component.html',
  styleUrl: './tasks-list.component.scss',
})
export class TasksListComponent implements OnInit {
  private readonly service = inject(TasksService);
  private readonly router = inject(Router);
  private readonly snack: MatSnackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);
  displayedColumns = ['title', 'description', 'priority', 'status','icon','due', 'actions'];
  tasks$ = toSignal(this.service.tasks$);
  datasource = new MatTableDataSource<Task>(this.tasks$() || []);

  search = new FormControl('', { nonNullable: true });
  status = new FormControl('', { nonNullable: true });
  priority = new FormControl('', { nonNullable: true });

  constructor() {
    effect(() => {
      this.datasource.data = this.tasks$() || [];
    })
  }

  ngOnInit() {
    // init
    this.service.init();
    this.search.valueChanges.pipe(debounceTime(300)).subscribe((v) => {
      this.datasource.filter = v.trim().toLowerCase();
    });
    this.status.valueChanges.subscribe((v) => this.service.setStatus(v));
    this.priority.valueChanges.subscribe((v) => this.service.setPriority(v));
  }

  add() {
    this.router.navigate(['/tasks/add']);
  }

  edit(task: Task) {
    console.log(task.id);
    if (task.id != null) this.router.navigate(['/tasks', task.id, 'edit']);
  }

  complete(task: Task) {
    if (!task.id) return;
    this.service.updateTask(task.id.toString(), { ...task, status: 'Completed' }).subscribe(() => {
      this.snack.open('Task marked as completed', 'Dismiss', { duration: 2500 });
    });
  }

  delete(task: Task) {
    if (!task.id) return;
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Delete Task', message: `Delete "${task.title}"?` },
    });
    ref.afterClosed().subscribe((ok: boolean) => {
      if (ok) {
        this.service.deleteTask(task.id!).subscribe(() => {
          this.snack.open('Task deleted', 'Dismiss', { duration: 2500 });
        });
      }
    });
  }
}
