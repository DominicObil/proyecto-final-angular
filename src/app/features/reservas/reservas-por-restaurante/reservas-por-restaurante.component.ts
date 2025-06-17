import { Component, OnInit } from '@angular/core';
import { ReservaService } from '../../../core/services/reserva.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reservas-por-restaurante',
  standalone: true,
  templateUrl: './reservas-por-restaurante.component.html',
  styleUrls: ['./reservas-por-restaurante.component.scss'],
  imports: [CommonModule]
})
export class ReservasPorRestauranteComponent implements OnInit {
  reservas: any[] = [];
  loading = true;
  error: string | null = null;
  restauranteId!: number;
  fechaActual = new Date().toISOString().split('T')[0];

  constructor(
    private reservaService: ReservaService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.restauranteId = Number(params.get('restauranteId'));

      if (this.restauranteId) {
        this.filtrarPorFecha(this.fechaActual);
      } else {
        this.error = 'No se proporcionó el ID del restaurante';
        this.loading = false;
      }
    });
  }

  irAEditar(reservaId: number) {
    this.router.navigate(['/editar-reserva', reservaId]);
  }

  borrarReserva(reservaId: number) {
    this.reservaService.borrarReserva(reservaId).subscribe({
      next: () => {
        this.reservas = this.reservas.filter(r => r.id !== reservaId);
      },
      error: () => {
        this.error = 'No se pudo borrar la reserva';
      }
    });
  }

  filtrarPorFecha(fecha: string) {
    this.loading = true;
    this.reservaService.getReservasPorRestauranteYFecha(this.restauranteId, fecha).subscribe({
      next: (data) => {
        this.reservas = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar reservas por fecha';
        this.loading = false;
      }
    });
  }
cambiarEstado(reservaId: number, nuevoEstado: string) {
  const reserva = this.reservas.find(r => r.id === reservaId);
  if (!reserva) return;

  const estadoEnum = nuevoEstado.toUpperCase(); // 👈

  this.reservaService.actualizarEstado(reservaId, { estado: estadoEnum }).subscribe({
    next: () => {
      reserva.estado = estadoEnum;
    },
    error: (err) => {
      console.error('Error al actualizar estado:', err);
      this.error = 'Error al actualizar el estado';
    }
  });
}


  onFechaChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const fecha = input?.value;
    if (fecha) {
      this.filtrarPorFecha(fecha);
    }
  }

  onEstadoChange(event: Event, reservaId: number) {
    const select = event.target as HTMLSelectElement;
    const nuevoEstado = select?.value;
    if (nuevoEstado) {
      this.cambiarEstado(reservaId, nuevoEstado);
    }
  }
}
