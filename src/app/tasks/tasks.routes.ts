import { Routes } from '@angular/router';
import { TasksPage } from './tasks.page';

export const TASKS_ROUTES: Routes = [
  {
    path: '',
    component: TasksPage,
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('./tasks-list/tasks-list.component').then(
            (m) => m.TasksListComponent
          ),
      },
      {
        path: 'add',
        loadComponent: () =>
          import('./task-form/task-form.component').then(
            (m) => m.TaskFormComponent
          ),
      },
      {
        path: ':id/edit',
        loadComponent: () =>
          import('./task-form/task-form.component').then(
            (m) => m.TaskFormComponent
          ),
      },
    ],
  },
];
