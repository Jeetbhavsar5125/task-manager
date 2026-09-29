import { Component, OnInit, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';
import { TaskService } from '../services/task.service';
import { Task } from '../models/task.model';

@Component({
  selector: 'app-task-list',
  imports: [],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css',
})
export class TaskList implements OnInit {

  tasks: Task[] = [];
  message: string = '';

  // 👇 NEW: emits a task upward when user clicks Edit
  @Output() editRequested = new EventEmitter<Task>();

  // Add this property at the top of the class (with tasks and message)
private localIdCounter = -1;   // starts at -1, decrements: -1, -2, -3...

// Updated newTask setter
@Input() set newTask(task: Task | null) {
  if (task) {
    const localTask: Task = {
      ...task,
      id: this.localIdCounter--   // assigns -1 first, then -2, then -3...
    };
    this.tasks.unshift(localTask);
    this.message = `✅ New task added! (Local ID: ${localTask.id})`;
    this.cdr.detectChanges();
  }
}


  // For PUT — find and replace existing task
  @Input() set updatedTask(task: Task | null) {
    if (task) {
      const exists = this.tasks.some(t => t.id === task.id);
      if (exists) {
        this.tasks = this.tasks.map(t => t.id === task.id ? task : t);
        this.message = `PUT 🔵 Task #${task.id} updated!`;
      } else {
        this.message = `PUT ⚠️ Task #${task.id} not in current view`;
      }
      this.cdr.detectChanges();
    }
  }

  constructor(
    private taskService: TaskService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    this.tasks = await this.taskService.getTasks();
    this.cdr.detectChanges();
  }

  async toggleComplete(task: Task) {
    const updated = await this.taskService.patchTask(task.id, {
      completed: !task.completed
    });
    task.completed = updated.completed;
    this.message = `PATCH ✅ Task #${task.id} marked as ${updated.completed ? 'completed' : 'incomplete'}`;
    this.cdr.detectChanges();
  }

  async deleteTask(id: number) {
    await this.taskService.deleteTask(id);
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.message = `DELETE 🗑️ Task #${id} removed`;
    this.cdr.detectChanges();
  }

  // 👇 NEW: called when Edit button is clicked
  requestEdit(task: Task) {
    this.editRequested.emit(task);  // send the task UP to app.ts
  }

}
