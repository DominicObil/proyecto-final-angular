import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ReservaService } from '../../../core/services/reserva.service';
import { RestaurantService } from '../../../core/services/restaurant.service'; // <-- Importa tu service de restaurantes
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-reserva-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './reserva-form.component.html',
  styleUrls: ['./reserva-form.component.scss']
})
export class ReservaFormComponent implements OnInit {
  form: FormGroup;
  restauranteNombre: string = '';
  restauranteId: number | null = null;

  // --- NUEVO: Propiedades para el estado UI ---
  loading = false;
  success: string | null = null;
  error: string | null = null;
  // --------------------------------------------

  private reservaService = inject(ReservaService);
  private restaurantService = inject(RestaurantService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  constructor(private fb: FormBuilder) {
  this.form = this.fb.group({
  fechaReserva: ['', Validators.required],
  horaReserva: ['', Validators.required],
  numeroPersonas: [1, [Validators.required, Validators.min(1)]],
  comentarios: [''],
  restauranteId: [{ value: null, disabled: true }, Validators.required],
});

  }

  ngOnInit(): void {
    const restauranteId = this.route.snapshot.paramMap.get('restauranteId');
    if (restauranteId) {
      this.restauranteId = Number(restauranteId);
      this.form.patchValue({ restauranteId: this.restauranteId });

      // Obtener el nombre del restaurante y mostrarlo
      this.restaurantService.fetchRestaurantById(this.restauranteId).subscribe({
        next: (restaurante) => {
          this.restauranteNombre = restaurante.nombre;
        },
        error: () => {
          this.restauranteNombre = 'Restaurante no encontrado';
        }
      });
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.loading = true;
      this.success = null;
      this.error = null;

      const data = this.form.getRawValue();
      this.reservaService.crearReserva(data).subscribe({
        next: () => {
          this.loading = false;
          this.success = 'Reserva realizada con éxito';
          // Navegar tras un pequeño delay para que se vea el mensaje de éxito
          setTimeout(() => {
            this.router.navigate(['/mis-reservas']);
          }, 1200);
        },
        error: (err) => {
          this.loading = false;
          this.error = 'Hubo un error al crear la reserva';
          console.error('❌ Error al crear reserva', err);
        },
      });
    }
  }
}
