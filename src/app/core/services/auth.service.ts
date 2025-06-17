import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/enviroments';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(
      `${environment.apiUrl}/v1/authenticate`,
      { username, password },
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      }
    );
  }
setToken(token: string): void {
  this.token.next(token);
  localStorage.setItem('token', token);

  // EXTRA: guardar el username desde el token
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const username = payload.sub || payload.username || payload.user || null;
    if (username) {
      localStorage.setItem('username', username);
    }
  } catch (e) {
    console.error('No se pudo extraer el username del token');
  }
}

  getToken(): string | null {
    const current = this.token.value;
    if (current) return current;

    const stored = localStorage.getItem('token');
    if (stored) {
      this.token.next(stored);
      return stored;
    }

    return null;
  }

  isLoggedIn(): Observable<boolean> {
    return this.token.asObservable().pipe(
      map((token: string | null) => !!token)
    );
  }

  logout(): void {
    this.token.next(null);
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }


  getUserById(id: number): Observable<any> {
  const token = this.getToken();
  const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

  return this.http.get(`${environment.apiUrl}/users/${id}`, { headers });
}


  /**
   * Obtiene el rol del usuario desde el token JWT.
   * El campo puede ser 'role', 'roles', o 'authorities' según tu backend.
   */getUserRole(): string | null {
  const token = this.getToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));

    // si es un array de roles:
    const rawRole = payload.role || payload.roles?.[0] || payload.authorities?.[0] || null;

    if (!rawRole) return null;

    // Elimina el prefijo "ROLE_" para trabajar más limpio
    return rawRole.replace('ROLE_', '');
  } catch {
    return null;
  }
}
isOwner(): boolean {
  return this.getUserRole() === 'OWNER';
}

isClient(): boolean {
  return this.getUserRole() === 'USER';
}

isAdmin(): boolean {
  return this.getUserRole() === 'ADMIN';
}

}