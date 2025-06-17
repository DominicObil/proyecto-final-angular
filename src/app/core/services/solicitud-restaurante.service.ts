import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/enviroments';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SolicitudRestauranteService {
  private readonly baseUrl = `${environment.apiUrl}/solicitudes-restaurante`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  crearSolicitud(data: any): Observable<any> {
    return this.http.post(this.baseUrl, data, {
      headers: this.getHeaders()
    });
  }

  getSolicitudes(page = 0, size = 10): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/solicitudes?page=${page}&size=${size}`,
      { headers: this.getHeaders() }
    );
  }

  aprobarSolicitud(id: number): Observable<string> {
    return this.http.post(`${this.baseUrl}/${id}/aprobar`, {}, {
      headers: this.getHeaders(),
      responseType: 'text' as const
    });
  }
rechazarSolicitud(id: number): Observable<string> {
  return this.http.delete(`${this.baseUrl}/${id}/rechazar`, {
    headers: this.getHeaders(),
    responseType: 'text' as const
  });
}

}
