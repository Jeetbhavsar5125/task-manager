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

  constructor(
    private taskService: TaskService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    console.log('TaskList initialized');
    this.tasks = await this.taskService.getTasks();
    this.cdr.detectChanges(); // Tell Angular to re-check the view after axios resolves
  }
}
