import { Component, OnInit, inject } from '@angular/core';
import { ReservaService } from '../../../core/services/reserva.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-mis-reservas',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './mis-reservas.component.html',
  styleUrls: ['./mis-reservas.component.scss']
})
export class MisReservasComponent implements OnInit {
  reservas: any[] = [];
  error: string | null = null;
  deleteError: string | null = null;

  private reservaService = inject(ReservaService);
  private router = inject(Router);

 ngOnInit(): void {
  this.reservaService.getMisReservas().subscribe({
    next: (res) => {
      // Hacemos una copia de las reservas y luego buscamos el nombre de cada restaurante
      this.reservas = res;

      this.reservas.forEach((reserva) => {
        if (reserva.restauranteId) {
          this.reservaService.fetchRestaurantById(reserva.restauranteId).subscribe({
            next: (restaurante) => reserva.restauranteNombre = restaurante.nombre,
            error: () => reserva.restauranteNombre = 'Nombre no disponible'
          });
        }
      });

      this.error = null;
    },
    error: () => {
      this.error = 'No se pudieron cargar las reservas';
    }
  });
}


  editarReserva(reservaId: number): void {
    this.router.navigate(['/editar-reserva', reservaId]);
  }

  borrarReserva(reservaId: number): void {
    this.reservaService.borrarReserva(reservaId).subscribe({
      next: () => {
        this.reservas = this.reservas.filter(r => r.id !== reservaId);
        this.deleteError = null;
      },
      error: () => {
        this.deleteError = 'No se pudo borrar la reserva. Intenta más tarde.';
      }
    });
  }
}
