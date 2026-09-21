import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse } from '../models/auth.models';

const TOKEN_KEY = 'sc_token';
const ROLE_KEY = 'sc_role';
const USERNAME_KEY = 'sc_username';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _token = signal<string | null>(localStorage.getItem(TOKEN_KEY));
  private readonly _role = signal<string | null>(localStorage.getItem(ROLE_KEY));
  private readonly _username = signal<string | null>(localStorage.getItem(USERNAME_KEY));

  readonly token = this._token.asReadonly();
  readonly role = this._role.asReadonly();
  readonly username = this._username.asReadonly();
  readonly isAuthenticated = computed(() => !!this._token());

  constructor(private http: HttpClient, private router: Router) {}

  login(request: LoginRequest) {
    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/auth/login`, request)
      .pipe(
        tap((response) => {
          localStorage.setItem(TOKEN_KEY, response.token);
          localStorage.setItem(ROLE_KEY, response.role);
          localStorage.setItem(USERNAME_KEY, response.username);
          this._token.set(response.token);
          this._role.set(response.role);
          this._username.set(response.username);
        })
      );
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(USERNAME_KEY);
    this._token.set(null);
    this._role.set(null);
    this._username.set(null);
    this.router.navigate(['/login']);
  }
}
