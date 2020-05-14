import { Injectable } from "@angular/core";

import { UserInterface } from "../auth/user.model";

@Injectable({
  providedIn: "root",
})
export class UserDataStorageService {
  private userList: UserInterface[] = [];

  constructor() {}

  getUserList() {
    return this.userList;
  }

  setUserList(list: UserInterface[]) {
    this.userList.splice(0, this.userList.length);

    list.forEach((elm) => {
      this.userList.push(elm);
    });
  }
}
