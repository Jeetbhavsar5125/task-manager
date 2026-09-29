import { Component } from '@angular/core';
import { TaskList } from './task-list/task-list';
import { TaskForm } from './task-form/task-form';
import { Task } from './models/task.model';

@Component({
  selector: 'app-root',
  imports: [TaskList, TaskForm],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  latestTask: Task | null = null;
  updatedTask: Task | null = null;
  taskToEdit: Task | null = null;     // 👈 NEW: task to pre-fill the form

  onTaskCreated(task: Task) {
    this.latestTask = task;
  }

  onTaskUpdated(task: Task) {
    this.updatedTask = task;
  }

  onEditRequested(task: Task) {       // 👈 NEW: receives task from task-list
    this.taskToEdit = task;
  }

}
