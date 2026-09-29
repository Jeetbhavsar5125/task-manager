import { Injectable } from '@angular/core';
import axios from 'axios';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private apiUrl = 'https://jsonplaceholder.typicode.com/todos';

  async getTasks(): Promise<Task[]> {
    const response = await axios.get<Task[]>(this.apiUrl);
    console.log('API Response:', response.data);
    return response.data.slice(0, 10);
  }
}