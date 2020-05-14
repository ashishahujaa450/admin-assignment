import { Injectable } from "@angular/core";

import { Task } from "./task.model";

@Injectable({
  providedIn: "root",
})
export class TaskService {
  private taskList: Task[] = [];

  constructor() {}

  //get task list using getter
  get getList() {
    return this.taskList;
  }

  //add task to list if needed
  addTask(item: Task) {
    this.taskList.push(item);
  }

  //remove task from the list
  removeTask(index: number) {
    this.taskList.splice(index, 1);
  }

  //fill list once
  fillList(data: Task[]) {
    this.taskList.splice(0, this.taskList.length);

    data.forEach((elm) => {
      this.taskList.push(elm);
    });
  }
}
