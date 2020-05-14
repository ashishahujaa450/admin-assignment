import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { map, tap } from "rxjs/operators";

import { Task } from "./task.model";
import { TaskService } from "./task.service";

@Injectable({
  providedIn: "root",
})
export class CrudDataService {
  private url: string = "https://assign-desk-cfe12.firebaseio.com/";

  constructor(private http: HttpClient, private taskService: TaskService) {}

  //adding task
  addTask(data: Task) {
    return this.http.post(`${this.url}tasks.json`, data);
  }

  //get tasks
  getTasks() {
    return this.http.get(`${this.url}tasks.json`).pipe(
      map((response: Task[]) => {
        const arr = new Array();

        //attaching id with the task object for delete or updatation
        for (let key in response) {
          const item = response[key];

          const updatedItem = {
            ...item,
            id: key,
          };

          arr.push(updatedItem);
        }

        return arr;
      }),
      tap((taskList: Task[]) => {
        this.taskService.fillList(taskList);
      })
    );
  }

  //update task
  updateTask(newTask: Task, id: string) {
    return this.http.put(`${this.url}tasks/${id}.json`, newTask);
  }

  //delete task
  deleteTask(id: string) {
    return this.http.delete(`${this.url}tasks/${id}.json`);
  }
}
