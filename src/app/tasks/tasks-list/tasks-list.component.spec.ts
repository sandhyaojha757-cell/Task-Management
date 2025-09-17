import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { TasksListComponent } from './tasks-list.component';
import { TasksService } from '../tasks.service';
import { provideZonelessChangeDetection } from '@angular/core';

describe('TasksListComponent', () => {
  let component: TasksListComponent;
  let fixture: ComponentFixture<TasksListComponent>;
  let tasksService: TasksService;
  let router: Router;

  const mockTasksService = {
    init: () => {},
    setSearch: () => {},
    setStatus: () => {},
    setPriority: () => {},
    tasks$: of([]),
  };

  const mockRouter = {
    navigate: jasmine.createSpy('navigate'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TasksListComponent],
      providers: [
        provideHttpClient(),
        provideZonelessChangeDetection(),
        provideNoopAnimations(),
        { provide: TasksService, useValue: mockTasksService },
        { provide: Router, useValue: mockRouter },
        { provide: MatDialog, useValue: {} },
        { provide: MatSnackBar, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TasksListComponent);
    component = fixture.componentInstance;
    tasksService = TestBed.inject(TasksService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize and subscribe to form changes on init', () => {
    spyOn(tasksService, 'init');
    spyOn(tasksService, 'setSearch');
    spyOn(tasksService, 'setStatus');
    spyOn(tasksService, 'setPriority');

    component.ngOnInit();

    expect(tasksService.init).toHaveBeenCalled();

    component.search.setValue('test search');
    component.status.setValue('Pending');
    component.priority.setValue('High');

    // Debounce time is 300ms
    setTimeout(() => {
      expect(tasksService.setSearch).toHaveBeenCalledWith('test search');
    }, 300);
    expect(tasksService.setStatus).toHaveBeenCalledWith('Pending');
    expect(tasksService.setPriority).toHaveBeenCalledWith('High');
  });

  it('should navigate to add task page', () => {
    component.add();
    expect(router.navigate).toHaveBeenCalledWith(['/tasks/add']);
  });

  it('should navigate to edit task page', () => {
    const task = { id: 1, title: 'Test', description: '', priority: 'Low' as const, status: 'Pending' as const };
    component.edit(task);
    expect(router.navigate).toHaveBeenCalledWith(['/tasks', 1, 'edit']);
  });
});
