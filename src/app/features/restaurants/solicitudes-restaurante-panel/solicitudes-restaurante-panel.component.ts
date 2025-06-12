import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SolicitudRestauranteService } from '../../../core/services/solicitud-restaurante.service';

@Component({
  selector: 'app-solicitudes-restaurante-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './solicitudes-restaurante-panel.component.html',
  styleUrls: ['./solicitudes-restaurante-panel.component.scss'],
})
export class SolicitudesRestaurantePanelComponent implements OnInit {
  solicitudes: any[] = [];
  loading = false;
  error: string | null = null;
  processing: { [id: number]: boolean } = {}; // para bloquear botones por fila

  constructor(private solicitudService: SolicitudRestauranteService) {}

  ngOnInit(): void {
    this.fetchSolicitudes();
  }

  fetchSolicitudes() {
    this.loading = true;
    this.error = null;
    this.solicitudService.getSolicitudes().subscribe({
      next: (data) => {
        // Aquí el cambio importante
        console.log('Respuesta de solicitudes:', data); // Para debug
        this.solicitudes = data.content; // <-- Ahora toma solo el array real
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar solicitudes';
        this.loading = false;
      }
    });
  }

aprobar(id: number) {
  this.processing[id] = true;
  this.error = null;
  this.solicitudService.aprobarSolicitud(id).subscribe({
    next: () => {
      this.fetchSolicitudes(); // <--- recarga todo
      this.processing[id] = false;
    },
    error: (err) => {
      this.error = 'Error al aprobar la solicitud';
      this.processing[id] = false;
    }
  });
}


rechazar(id: number) {
  this.processing[id] = true;
  this.error = null;
  this.solicitudService.rechazarSolicitud(id).subscribe({
    next: () => {
      this.solicitudes = this.solicitudes.filter(s => s.id !== id);
      this.processing[id] = false;
    },
    error: (err) => {
      if (err.status === 404) {
        this.solicitudes = this.solicitudes.filter(s => s.id !== id);
        this.error = 'La solicitud ya no existe o fue procesada.';
      } else {
        this.error = 'Error al rechazar la solicitud';
      }
      this.processing[id] = false;
    }
  });
}

}
