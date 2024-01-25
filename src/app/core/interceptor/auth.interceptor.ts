import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable, iif, of } from 'rxjs';
import { catchError, first, mergeMap, withLatestFrom } from 'rxjs/operators';
import { AuthService } from '../service/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.authService.isLogged$
      .pipe(
        first(),
        withLatestFrom(this.authService.token$),
        mergeMap(([isLogged, tk]) =>
          iif(
            () => isLogged,
            next.handle(
              req.clone({
                setHeaders: {
                  authentication: tk,
                  'content-type': 'application/vnd.api+json'
                },
                url:
                  (environment.backendHost
                    ? environment.backendHost
                    : 'https://vn-fe-test-api.iwalabs.info') + req.url
              })
            ),
            next.handle(
              req.clone({
                url:
                  (environment.backendHost
                    ? environment.backendHost
                    : 'https://vn-fe-test-api.iwalabs.info') + req.url
              })
            )
          )
        )
      )
      .pipe(
        catchError(err => {
          if (err instanceof HttpErrorResponse) {
            switch (err.status) {
              case 403:
                console.log('Token expired!!!');
                this.authService.logout();
                break;
              default:
                throw new HttpErrorResponse(err);
            }
          }
          return of(err);
        })
      );
  }
}
