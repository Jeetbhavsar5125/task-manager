import { Component, ChangeDetectorRef, Output, Input, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../services/task.service';
import { Task } from '../models/task.model';

@Component({
  selector: 'app-task-form',
  imports: [FormsModule],
  templateUrl: './task-form.html',
  styleUrl: './task-form.css'
})
export class TaskForm {

  title: string = '';
  completed: boolean = false;
  taskId: number = 1;
  responseData: Task | null = null;
  message: string = '';
  isLoading: boolean = false;

  @Output() taskCreated = new EventEmitter<Task>();
  @Output() taskUpdated = new EventEmitter<Task>();

  // 👇 NEW: when task-list sends a task to edit, pre-fill the form
  @Input() set taskToEdit(task: Task | null) {
    if (task) {
      this.title = task.title;          // fill title field
      this.taskId = task.id;            // fill ID field
      this.completed = task.completed;  // fill checkbox
      this.message = `✏️ Editing Task #${task.id} — click PUT to save`;
      this.cdr.detectChanges();
    }
  }

  constructor(
    private taskService: TaskService,
    private cdr: ChangeDetectorRef
  ) {}

  async onPost() {
    this.isLoading = true;
    this.message = '';
    const newTask = { title: this.title, completed: this.completed, userId: 1 };
    this.responseData = await this.taskService.createTask(newTask);
    this.message = `POST ✅ New task created! Server gave it ID: ${this.responseData.id}`;
    this.taskCreated.emit(this.responseData);
    this.isLoading = false;
    this.cdr.detectChanges();
  }

 async onPut() {
  this.isLoading = true;
  this.message = '';

  // 🔍 Check: is this a locally created task?
  if (this.taskId < 0) {
    // Local task — skip the server call, update only in the browser
    const localTask: Task = {
      id: this.taskId,
      userId: 1,
      title: this.title,
      completed: this.completed
    };
    this.responseData = localTask;
    this.message = `PUT ✅ Local task #${this.taskId} updated (no server needed)!`;
    this.taskUpdated.emit(localTask);   // emit so task-list updates
    this.isLoading = false;
    this.cdr.detectChanges();
    return;    // ← exit early, skip the server call below
  }

  // Server task — make the actual PUT request
  const replacedTask: Task = {
    id: this.taskId,
    userId: 1,
    title: this.title,
    completed: this.completed
  };
  this.responseData = await this.taskService.replaceTask(this.taskId, replacedTask);
  this.message = `PUT 🔵 Task #${this.taskId} fully replaced on server!`;
  this.taskUpdated.emit(this.responseData);
  this.isLoading = false;
  this.cdr.detectChanges();
}


}
