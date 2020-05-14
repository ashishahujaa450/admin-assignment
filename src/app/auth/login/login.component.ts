import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { Observable, Subscription } from "rxjs";

import { AuthService } from "../auth.service";
import { AuthInterface, AuthResponse } from "../auth.model";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit, OnDestroy {
  private authObs: Observable<AuthResponse>;
  private authSubscription: Subscription;

  public isLogin: boolean = true;
  public errorMessage: string = null;
  public isLoading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  //toggle state of login & signup
  toggleState() {
    this.isLogin = !this.isLogin;
    this.errorMessage = null;
  }

  //submit form
  onSubmit(form: NgForm) {
    const value = form.form.value;

    const data: AuthInterface = {
      email: value.userEmail,
      password: value.userPwd,
      returnSecureToken: true,
      userName: value.userName,
    };

    this.isLoading = true;
    if (this.isLogin) {
      //lets login
      this.authObs = this.authService.logIn(data);
    } else {
      //lets signup
      this.authObs = this.authService.signUp(data);
    }

    //subscribe to observable
    this.authSubscription = this.authObs.subscribe(
      (response) => {
        this.isLoading = false;
        //routing
        this.router.navigate(["admin"]);
      },
      (errorMessage) => {
        //error handeling & loading spinner
        this.isLoading = false;
        this.errorMessage = errorMessage;
      }
    );
  }

  //unsubscribing subscriptions
  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
