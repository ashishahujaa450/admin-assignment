import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";

import { map, tap } from "rxjs/operators";

import { UserInterface } from "../auth/user.model";
import { UserDataStorageService } from "./user-cloud-storage.service";

@Injectable({
  providedIn: "root",
})
export class UserStorageService {
  private UserStoreUrl: string = "https://assign-desk-cfe12.firebaseio.com/";

  constructor(
    private http: HttpClient,
    private userListStorage: UserDataStorageService
  ) {}

  //storing user to realtime databse when signup
  storeUser(user: UserInterface, verifiedUser) {
    return this.http.post(`${this.UserStoreUrl}users.json`, user, {
      params: new HttpParams().set("auth", verifiedUser),
    });
  }

  //fetching user from realtime database when login
  fetchUser(email: string) {
    return this.http.get(`${this.UserStoreUrl}users.json`).pipe(
      map((response) => {
        const newUsersModifiedList = new Array();

        for (let key in response) {
          const userObj = response[key];

          const modifiedUser = { ...userObj, treeKey: key };
          newUsersModifiedList.push(modifiedUser);
        }
        return newUsersModifiedList;
      }),
      tap((userList) => {
        //filling user list
        this.userListStorage.setUserList(userList);
      })
    );
  }
}
