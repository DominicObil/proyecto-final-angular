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
  processing: { [id: number]: boolean } = {};

  constructor(private solicitudService: SolicitudRestauranteService) {}

  ngOnInit(): void {
    this.fetchSolicitudes();
  }

  fetchSolicitudes() {
    this.loading = true;
    this.solicitudService.getSolicitudes().subscribe({
      next: (data) => {
        this.solicitudes = data.content;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar solicitudes';
        this.loading = false;
      }
    });
  }

  aprobar(id: number) {
    this.processing[id] = true;
    this.solicitudService.aprobarSolicitud(id).subscribe({
      next: () => {
        // Elimina la solicitud aprobada del array
        this.solicitudes = this.solicitudes.filter(s => s.id !== id);
        this.processing[id] = false;
      },
      error: () => {
        this.processing[id] = false;
      }
    });
  }

  rechazar(id: number) {
    this.processing[id] = true;
    this.solicitudService.rechazarSolicitud(id).subscribe({
      next: () => {
        this.solicitudes = this.solicitudes.filter(s => s.id !== id);
        this.processing[id] = false;
      },
      error: () => {
        this.processing[id] = false;
      }
    });
  }
}
