import { Component, OnInit, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Router } from '@angular/router';
import { RestaurantService } from '../../core/services/restaurant.service';
import { NgIf, NgForOf, JsonPipe, AsyncPipe } from '@angular/common';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-restaurants',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    JsonPipe,
    AsyncPipe,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './restaurants.component.html',
  styleUrls: ['./restaurants.component.scss']
})
export class RestaurantsComponent implements OnInit {
  restaurantes = signal<any[]>([]);
  filtro = new FormControl('');
  error = signal<string | null>(null);

  constructor(
    private restaurantService: RestaurantService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.setupFiltro();
  }

  private loadData(): void {
    this.restaurantService.fetchRestaurants(0, 100, 'nombre', 'asc').subscribe({
      next: (res) => {
        this.restaurantes.set(res.content);
        this.error.set(null);
      },
      error: (err) => {
        this.error.set('Error al cargar restaurantes');
        console.error(err);
      }
    });
  }

  private setupFiltro(): void {
    this.filtro.valueChanges.pipe(debounceTime(300)).subscribe();
  }

  get filteredData(): any[] {
    const term = this.filtro.value?.toLowerCase().trim() || '';
    return this.restaurantes().filter(r =>
      r.nombre.toLowerCase().includes(term) ||
      r.direccion.toLowerCase().includes(term)
    );
  }

  goToReservaForm(restauranteId: number): void {
    this.router.navigate(['/reservar', restauranteId]);
  }
}
