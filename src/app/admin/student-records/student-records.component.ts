import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription, Observable } from "rxjs";

import { CrudDataService } from "src/app/shared/crud-data.service";
import { Task } from "src/app/shared/task.model";
import { TaskService } from "src/app/shared/task.service";

@Component({
  selector: "app-student-records",
  templateUrl: "./student-records.component.html",
  styleUrls: ["./student-records.component.css"],
})
export class StudentRecordsComponent implements OnInit, OnDestroy {
  public taskList: Task[];
  public isLoading: boolean = false;
  public taskTitleHead: string = "";
  public editMode: boolean = false;
  public editModeId: string;

  private recordSubscription: Subscription;
  private recordObs: Observable<any>;
  private removeRecordSubscription: Subscription;
  private recordSub: Subscription;

  constructor(
    private crudDataService: CrudDataService,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.taskList = this.taskService.getList;

    //making request
    this.getTaskData();
  }

  //on form submit
  onSubmit(form: NgForm) {
    const value = form.form.value;

    //checking if form is valid
    if (form.valid) {
      //control loader spinner
      this.isLoading = true;

      //edit mode detection
      if (this.editMode) {
        //edit task
        this.recordObs = this.crudDataService.updateTask(
          value,
          this.editModeId
        );
      } else {
        //add task
        this.recordObs = this.crudDataService.addTask(value);
      }

      //subscribe to obs
      this.recordSub = this.recordObs.subscribe((response) => {
        this.getTaskData();
      });

      //clearing form & utilities
      form.reset();
      this.editMode = false;
      this.editModeId = null;
    }
  }

  //fetch tasks list
  private getTaskData() {
    this.recordSubscription = this.crudDataService
      .getTasks()
      .subscribe((response) => {
        this.isLoading = false;
      });
  }

  //task delete
  onDelete(id: string) {
    //control spinner
    this.isLoading = true;

    //delete task from the list
    this.removeRecordSubscription = this.crudDataService
      .deleteTask(id)
      .subscribe((response) => {
        this.getTaskData();
      });
  }

  //task edit
  onEdit(task: Task) {
    //edit mode true
    this.editMode = true;
    this.editModeId = task.id;

    this.taskTitleHead = task.taskTitle;
  }

  //unsubscribing observables to avoid memory leaks
  ngOnDestroy() {
    if (this.recordSubscription) {
      this.recordSubscription.unsubscribe();
    }

    if (this.removeRecordSubscription) {
      this.removeRecordSubscription.unsubscribe();
    }

    if (this.recordSub) {
      this.recordSub.unsubscribe();
    }
  }
}
