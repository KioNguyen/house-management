import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, first, map } from 'rxjs';
import { AuthService } from '../service/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private route: Router) {}
  canActivate(): Observable<boolean> {
    return this.authService.isLogged$.pipe(
      first(),
      map(isLogged => {
        if (!isLogged) {
          this.route.navigateByUrl('/');
        }
        return isLogged;
      })
    );
  }
}
