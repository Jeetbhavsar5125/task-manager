import { Injectable } from '@angular/core';
import axios from 'axios';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private apiUrl = 'https://jsonplaceholder.typicode.com/todos';
//GET method
  async getTasks(): Promise<Task[]> {
    const response = await axios.get<Task[]>(this.apiUrl);
    console.log('API Response:', response.data);
    return response.data.slice(0, 10);
  }
  //PATCH method
  async patchTask(id: number, changes: Partial<Task>): Promise<Task> {
    const response = await axios.patch<Task>(`${this.apiUrl}/${id}`, changes);
    return response.data;
  } 
  //DELETE method
  async deleteTask(id: number): Promise<void> {
    await axios.delete(`${this.apiUrl}/${id}`);
  }
  //POST method
  async createTask(task : { title: string ;completed:boolean;userId:number}):
  Promise<Task>{
    const response = await axios.post<Task>(this.apiUrl,task);
    return response.data;
  }
  async replaceTask(id : number,task:Task):Promise<Task>{
    const response = await axios.put<Task>(`${this.apiUrl}/${id}`,task);
    return response.data;
  }
}