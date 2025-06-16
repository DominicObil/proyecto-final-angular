import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/enviroments';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class ReservaService {
  private readonly baseUrl = `${environment.apiUrl}/reservas`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  crearReserva(data: any): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.post(this.baseUrl, data, { headers });
  }

  getMisReservas(): Observable<any[]> {
  const token = this.authService.getToken();
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });
  return this.http.get<any[]>(`${this.baseUrl}/mis`, { headers });
}

borrarReserva(id: number): Observable<any> {
  const token = this.authService.getToken();
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });
  return this.http.delete(`${this.baseUrl}/${id}`, { headers });
}

actualizarReserva(id: number, data: any): Observable<any> {
  const token = this.authService.getToken();
  const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
  return this.http.put(`${this.baseUrl}/${id}`, data, { headers });
}
obtenerReservaPorId(id: number): Observable<any> {
  const token = this.authService.getToken();
  const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
  return this.http.get(`${this.baseUrl}/${id}`, { headers });
}

// src/app/core/services/reserva.service.ts
  // --- ARREGLADO AQUÍ ---
  getReservasPorRestaurante(restauranteId: number): Observable<any[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    // Usa la misma baseUrl
    return this.http.get<any[]>(`${this.baseUrl}/restaurante/${restauranteId}`, { headers });
  }

  getReservasPorRestauranteYFecha(restauranteId: number, fecha: string): Observable<any[]> {
  const token = this.authService.getToken();
  const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
  return this.http.get<any[]>(`${this.baseUrl}/restaurante/${restauranteId}/fecha/${fecha}`, { headers });
}

fetchRestaurantById(id: number): Observable<any> {
  const token = this.authService.getToken();
  const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
  return this.http.get(`${environment.apiUrl}/restaurantes/${id}`, { headers });
}



actualizarEstado(id: number, data: { estado: string }): Observable<any> {
  const token = this.authService.getToken();
  const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
  return this.http.patch(`${this.baseUrl}/${id}/estado`, data, { headers });
}




}
