import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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

  constructor(
    private taskService: TaskService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    console.log('TaskList initialized');
    this.tasks = await this.taskService.getTasks();
    this.cdr.detectChanges(); // Tell Angular to re-check the view after axios resolves
  }
  async toggleComplete(task : Task ){
    const updated = await this.taskService.patchTask(task.id,{
      completed : !task.completed
    });
    task.completed = updated.completed;
    this.message = `Patch task #${task.id} marked as ${updated.completed ? 'completed': 'incomplete '}`;
    this.cdr.detectChanges();
  }
  // DELETE - remove task from the list
  async deleteTask(id: number){
    await this.taskService.deleteTask(id);
    // remove from the local array
    this.tasks = this.tasks.filter(t=>t.id !== id);
    this.message = `Delete task #${id}`;
    this.cdr.detectChanges();
  }
}
