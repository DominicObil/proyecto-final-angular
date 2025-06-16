import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservaService } from '../../../core/services/reserva.service';
import { RestaurantService } from '../../../core/services/restaurant.service';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-editar-reserva',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './editar-reserva.component.html',
  styleUrls: ['./editar-reserva.component.scss']
})
export class EditarReservaComponent implements OnInit {
  form: FormGroup;
  reservaId!: number;
  restauranteId!: number;
  restauranteNombre: string = '';
  error: string | null = null;
  loading = false;
  success: string = '';

  private reservaService = inject(ReservaService);
  private restaurantService = inject(RestaurantService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      fechaReserva: ['', Validators.required],
      horaReserva: ['', Validators.required],
      numeroPersonas: [1, [Validators.required, Validators.min(1)]],
      comentarios: [''],
      turnoId: [null], // 👈 ya no es obligatorio
      restauranteId: [{ value: null, disabled: true }, Validators.required],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.reservaId = Number(id);
      this.reservaService.obtenerReservaPorId(this.reservaId).subscribe({
        next: (reserva) => {
          this.form.patchValue(reserva);
          this.restauranteId = reserva.restauranteId;
          this.restaurantService.fetchRestaurantById(reserva.restauranteId).subscribe({
            next: (restaurante) => this.restauranteNombre = restaurante.nombre,
            error: () => this.restauranteNombre = 'Restaurante no encontrado'
          });
        },
        error: () => this.error = 'No se pudo cargar la reserva'
      });
    } else {
      this.error = 'Reserva no encontrada';
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const data = this.form.getRawValue();
      this.loading = true;

      this.reservaService.actualizarReserva(this.reservaId, data).subscribe({
        next: () => this.redirigirTrasGuardar(),
        error: () => {
          this.error = '❌ Error al actualizar reserva';
          this.loading = false;
        }
      });
    }
  }

  redirigirTrasGuardar() {
    const rol = this.authService.getUserRole();
    if (rol === 'OWNER') {
      this.router.navigate(['/mis-restaurantes']);
    } else {
      this.router.navigate(['/mis-reservas']);
    }
  }

  irAMisReservas() {
    this.redirigirTrasGuardar();
  }
}
