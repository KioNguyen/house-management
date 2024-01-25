import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  catchError,
  map,
  of,
  retry,
  switchMap
} from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { User } from '@data/schema/user';

interface LoginContextInterface {
  username: string;
  password: string;
}

const defaultToken = localStorage.getItem('token');

interface LoginResponse {
  data: {
    type: string;
    attributes: {
      token: string;
    };
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  token$: BehaviorSubject<string> = new BehaviorSubject<string>(defaultToken);
  private user$: BehaviorSubject<{
    username: string;
  } | null> = new BehaviorSubject<{
    username: string;
  } | null>(null);

  constructor(private _http: HttpClient) {}
  get isLogged$(): Observable<boolean> {
    return this.token$.pipe(
      switchMap(token => this.isValidToken(token).pipe(map(isValid => isValid)))
    );
  }

  get getUser$(): Observable<{ username: string } | null> {
    return this.user$.pipe();
  }

  login(loginContext: LoginContextInterface): Observable<User> {
    const { username, password } = loginContext;
    const dPost = {
      data: {
        type: 'auth',
        attributes: { username, password }
      }
    };

    return this._http.post<LoginResponse>('/auth', dPost).pipe(
      retry(3),
      map(res => {
        if (res) {
          const { token } = res.data.attributes;
          this.token$.next(token);
          this.user$.next({ username });
          localStorage.setItem('token', token);
          localStorage.setItem('username', username);
          return { username, token };
        }
        return null;
      }),
      catchError(err => {
        console.log('🚀 ~ AuthService ~ login ~ err:', err);
        return of(null);
      })
    );
  }

  logout(): Observable<boolean> {
    this.token$.next(null);
    this.user$.next(null);
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    return of(false);
  }

  private isValidToken(token: string): Observable<boolean> {
    if (token) {
      //TODO: check if token is valid
      return of(true);
    }
    return of(false);
  }
}
