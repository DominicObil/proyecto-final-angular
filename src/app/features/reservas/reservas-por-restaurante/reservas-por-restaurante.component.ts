import { Component, OnInit } from '@angular/core';
import { ReservaService } from '../../../core/services/reserva.service';
import { ActivatedRoute, Router } from '@angular/router'; // <-- Importa Router
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
  fechaActual = new Date().toISOString().split('T')[0]; // yyyy-MM-dd


  constructor(
    private reservaService: ReservaService,
    private route: ActivatedRoute,
    private router: Router // <-- Añade el Router aquí
  ) {}

  ngOnInit(): void {
  this.route.paramMap.subscribe(params => {
    this.restauranteId = Number(params.get('restauranteId'));

    if (this.restauranteId) {
      this.filtrarPorFecha(this.fechaActual); // 👈 Mostrar reservas de hoy
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
    if (confirm('¿Seguro que quieres borrar esta reserva?')) {
      this.reservaService.borrarReserva(reservaId).subscribe({
        next: () => this.reservas = this.reservas.filter(r => r.id !== reservaId),
        error: () => alert('No se pudo borrar la reserva')
      });
    }
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

  const actualizada = { estado: nuevoEstado };

  this.reservaService.actualizarEstado(reservaId, actualizada).subscribe({
    next: () => {
      reserva.estado = nuevoEstado; // actualiza en la vista
    },
    error: () => alert('Error al actualizar el estado')
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
