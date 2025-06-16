import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/enviroments';

@Injectable({
  providedIn: 'root',
})
export class RestaurantService {
  private readonly baseUrl = `${environment.apiUrl}/restaurantes`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  /**
   * Obtiene la lista paginada y ordenada de restaurantes desde la API.
   */
  fetchRestaurants(
    page: number,
    size: number,
    sort: string,
    dir: 'asc' | 'desc'
  ): Observable<any> {
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const params = {
      page: page.toString(),
      size: size.toString(),
      sort: `${sort},${dir}`,
    };

    return this.http.get(this.baseUrl, { headers, params });
  }
  fetchRestaurantById(id: number): Observable<any> {
  const token = this.authService.getToken();
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });
  return this.http.get(`${this.baseUrl}/${id}`, { headers });
}
getMisRestaurantes(): Observable<any[]> {
  const token = this.authService.getToken();
  const headers = { Authorization: `Bearer ${token}` };
  // Ajusta el endpoint a como lo tengas en el backend
  return this.http.get<any[]>(`${this.baseUrl}/mis-restaurantes`, { headers });
}


deleteRestaurant(id: number): Observable<any> {
  const token = this.authService.getToken();
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });
  return this.http.delete(`${this.baseUrl}/${id}`, { headers });
}

updateRestaurant(id: number, restaurante: any): Observable<any> {
  const token = this.authService.getToken();
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });
  return this.http.put(`${this.baseUrl}/${id}`, restaurante, { headers });
}

searchRestaurants(filtro: string): Observable<any> {
  const token = this.authService.getToken();
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });

  return this.http.get(`${this.baseUrl}?search=${filtro}`, { headers });
}


 

}

