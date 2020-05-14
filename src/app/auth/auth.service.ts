import { Injectable, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";

import { throwError, BehaviorSubject } from "rxjs";
import { catchError, tap, map } from "rxjs/operators";

import { environment } from "src/environments/environment";

import { AuthInterface, AuthResponse } from "./auth.model";
import { User, UserInterface } from "./user.model";
import { UserStorageService } from "../shared/user.service";

@Injectable({
  providedIn: "root",
})
export class AuthService implements OnDestroy {
  private signUpUrl: string =
    "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=";
  private loginUrl: string =
    "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=";

  public user = new BehaviorSubject<User>(null);
  public expireTimer: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private userStorage: UserStorageService
  ) {}

  //logout
  logout() {
    this.router.navigate(["login"]);
    this.user.next(null);

    //removing local storage
    localStorage.removeItem(environment.user);

    //clearing session
    if (this.expireTimer) {
      clearTimeout(this.expireTimer);
    }
  }

  //autologout when token expires
  private autoLogout(expirationTimer: number) {
    this.expireTimer = setTimeout(() => {
      this.logout();
    }, expirationTimer);
  }

  //autologin when reloads app
  autoLogin() {
    //getting user from the localstorage
    const loadeduser = JSON.parse(localStorage.getItem(environment.user));

    if (loadeduser) {
      const verifiedUser = new User(
        loadeduser.email,
        loadeduser.id,
        loadeduser._token,
        new Date(loadeduser._tokenExpiration),
        loadeduser.name
      );

      //checking token & user
      if (verifiedUser && verifiedUser.token) {
        this.user.next(verifiedUser);

        const expiretime =
          new Date(loadeduser._tokenExpiration).getTime() -
          new Date().getTime();

        //calling autologout if time expires
        this.autoLogout(expiretime);
      } else {
        return;
      }
    }
  }

  //error handeling
  private handleError(error: string): string {
    let message = "An Unknown Error Occured, Please try again!";

    switch (error) {
      case "EMAIL_EXISTS":
        message = "Email Already in Use!";
        break;

      case "OPERATION_NOT_ALLOWED":
        message = "Following operation not allowed!";
        break;

      case "TOO_MANY_ATTEMPTS_TRY_LATER":
        message =
          "We have blocked all requests from this device due to unusual activity. Try again later!";
        break;

      case "EMAIL_NOT_FOUND":
        message = "Email address is not found. Please enter a valid email!";
        break;

      case "INVALID_PASSWORD":
        message = "The Password is Invalid!";
        break;

      case "USER_DISABLED":
        message = "The user account has been disabled by an administrator.";
        break;

      default:
        message = "An Unknown Error Occured, Please try again!";
    }

    return message;
  }

  //handeling auth for login & signup
  private handleAuth(
    data: AuthResponse,
    authData: AuthInterface,
    fromWhere: string
  ) {
    const expireTime = new Date(new Date().getTime() + +data.expiresIn * 1000);

    //creating user instance
    const loadeduser = new User(
      data.email,
      data.localId,
      data.idToken,
      expireTime,
      authData.userName
    );

    //emit user
    this.user.next(loadeduser);

    //autlogout functionallity
    this.autoLogout(+data.expiresIn * 1000);

    if (fromWhere === "fromSignUp") {
      //store user on sign up

      const singleUser: UserInterface = {
        email: data.email,
        localId: data.localId,
        password: authData.password,
        name: authData.userName,
      };

      this.userStorage
        .storeUser(singleUser, loadeduser)
        .subscribe((response) => {
          //empty block
        });

      //set data to localstorage
      localStorage.setItem(environment.user, JSON.stringify(loadeduser));
    } else {
      //fetch user on login
      this.userStorage.fetchUser(data.email).subscribe((response) => {
        response.forEach((elm) => {
          if (elm.email === data.email) {
            loadeduser.name = elm.name;
            //setting data to localstorage
            localStorage.setItem(environment.user, JSON.stringify(loadeduser));
          }
        });
      });
    }
  }

  //sign up user
  signUp(data: AuthInterface) {
    return this.http
      .post<AuthResponse>(`${this.signUpUrl}${environment.webApiKey}`, data)
      .pipe(
        tap((response) => {
          this.handleAuth(response, data, "fromSignUp");
        }),
        catchError((response) => {
          return throwError(this.handleError(response.error.error.message));
        })
      );
  }

  //login
  logIn(data: AuthInterface) {
    return this.http
      .post<AuthResponse>(`${this.loginUrl}${environment.webApiKey}`, data)
      .pipe(
        tap((response) => {
          this.handleAuth(response, data, "fromLogin");
        }),
        catchError((response) => {
          return throwError(this.handleError(response.error.error.message));
        })
      );
  }

  ngOnDestroy() {}
}
