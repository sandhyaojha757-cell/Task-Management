import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './task.model';
import { environment } from '../../environments/environment';

describe('TasksService', () => {
  let service: TasksService;
  let httpTestingController: HttpTestingController;
  const API_URL = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TasksService],
    });
    service = TestBed.inject(TasksService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch tasks from the API via GET', () => {
    const mockTasks: Task[] = [
      { id: 1, title: 'Test Task 1', description: 'Description 1', status: 'Pending', priority: 'Low' },
      { id: 2, title: 'Test Task 2', description: 'Description 2', status: 'Completed', priority: 'High' },
    ];

    service.fetchTasks().subscribe();

    const req = httpTestingController.expectOne(`${API_URL}/tasks`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTasks);

    service.tasks$.subscribe(tasks => {
      expect(tasks).toEqual(mockTasks);
    });
  });

  it('should add a task via POST', () => {
    const newTask: Task = { title: 'New Task', description: 'New Desc', status: 'Pending', priority: 'Medium' };
    const mockTask: Task = { id: 3, ...newTask };

    service.addTask(newTask).subscribe(task => {
      expect(task).toEqual(mockTask);
    });

    const req = httpTestingController.expectOne(`${API_URL}/tasks`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newTask);
    req.flush(mockTask);
  });

  it('should update a task via PUT', () => {
    const updatedTask: Task = { id: 1, title: 'Updated Task', description: 'Updated Desc', status: 'In Progress', priority: 'High' };

    service.updateTask(updatedTask.id!.toString(), updatedTask).subscribe(task => {
      expect(task).toEqual(updatedTask);
    });

    const req = httpTestingController.expectOne(`${API_URL}/tasks/${updatedTask.id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedTask);
    req.flush(updatedTask);
  });

  it('should delete a task via DELETE', () => {
    const taskId = 1;

    service.deleteTask(taskId).subscribe(res => {
      expect(res).toBeNull();
    });

    const req = httpTestingController.expectOne(`${API_URL}/tasks/${taskId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should get a single task by id via GET', () => {
    const mockTask: Task = { id: 1, title: 'Test Task 1', description: 'Description 1', status: 'Pending', priority: 'Low' };

    service.getTask(1..toString()).subscribe(task => {
      expect(task).toEqual(mockTask);
    });

    const req = httpTestingController.expectOne(`${API_URL}/tasks/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTask);
  });
});
