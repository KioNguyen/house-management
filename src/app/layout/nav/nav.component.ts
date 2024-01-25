import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';

import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '@app/core/service/auth.service';
import { ThemeService } from '@core/service/theme.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  error: string;
  userName: Observable<string>;
  currUser: { username: string } | null;
  isLoading: boolean;
  isLogged: boolean;
  loginForm: UntypedFormGroup;

  public isDarkTheme$: Observable<boolean>;

  navItems = [
    { link: '/dashboard/home', title: 'Home' },
    { link: '/about', title: 'About' },
    { link: '/contact', title: 'Contact' }
  ];

  constructor(
    private themeService: ThemeService,
    private formBuilder: UntypedFormBuilder,
    private authService: AuthService,
    private _snackBar: MatSnackBar
  ) {
    this.buildForm();
  }
  get f() {
    return this.loginForm.controls;
  }

  ngOnInit() {
    this.isDarkTheme$ = this.themeService.getDarkTheme();
    this.authService.isLogged$.pipe().subscribe(isLogged => {
      this.isLogged = isLogged;
    });
    this.authService.getUser$.pipe().subscribe(user => {
      this.currUser = user;
    });
  }

  logout() {
    this.authService.logout();
  }

  toggleTheme(checked: boolean) {
    this.themeService.setDarkTheme(checked);
  }

  login() {
    this.isLoading = true;
    const credentials = this.loginForm.value;
    this.authService
      .login(credentials)
      .pipe(
        map(res => {
          if (!res) {
            this._snackBar.open('Wrong username or password', 'Close', {
              horizontalPosition: 'right',
              verticalPosition: 'bottom',
              duration: 3000
            });
          }
          this.isLoading = false;
        })
      )
      .subscribe();
  }

  private buildForm(): void {
    this.loginForm = this.formBuilder.group({
      username: ['admin', Validators.required],
      password: ['p@ssw0rd', Validators.required]
    });
  }
}
