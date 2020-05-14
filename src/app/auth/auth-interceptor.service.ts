import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpParams,
} from "@angular/common/http";
import { Injectable } from "@angular/core";

import { take, exhaustMap } from "rxjs/operators";

import { AuthService } from "./auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.authService.user.pipe(
      take(1),
      exhaustMap((user) => {
        //checking user & token existense
        if (!user || !user.token) {
          return next.handle(req);
        }

        //modifying request with the token
        const modifiedRequest = req.clone({
          params: new HttpParams().set("auth", user.token),
        });

        return next.handle(modifiedRequest);
      })
    );
  }
}
