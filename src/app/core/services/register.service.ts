import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/enviroments';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private readonly baseUrl = `${environment.apiUrl}/v1`;

  constructor(private http: HttpClient) {}

  register(data: any): Observable<string> {
    return this.http.post(`${this.baseUrl}/register`, data, {
      responseType: 'text' as const  // 🔧 Esta línea evita el intento de parseo JSON
    });
  }
}
