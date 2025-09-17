import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TasksService } from '../tasks.service';
import { Task } from '../task.model';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CommonModule
  ],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
})
export class TaskFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(TasksService);
  private readonly snack: MatSnackBar = inject(MatSnackBar);

  id: string | null = null;
  form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(100)]],
    description: [''],
    priority: ['Medium', Validators.required],
    status: ['Pending', Validators.required],
      icon: [''],
    dueDate: [null as string | null, Validators.required] 
  });

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    // console.log(idParam);
    this.id = idParam;
    if (this.id) {
      console.log(this.id);
      this.service.getTask(this.id).subscribe((task) => this.form.patchValue(task));
    }
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue() as Task;
    const req = this.id
      ? this.service.updateTask(this.id, value)
      : this.service.addTask(value);
    req.subscribe(() => {
      this.snack.open('Task saved', 'Dismiss', { duration: 2500 });
      this.router.navigate(['/tasks']);
    });
  }
}
