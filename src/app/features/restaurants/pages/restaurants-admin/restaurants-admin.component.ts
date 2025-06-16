import { Component, OnInit } from '@angular/core';
import { RestaurantService } from '../../../../core/services/restaurant.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-restaurants-admin',
  standalone: true,
  templateUrl: './restaurants-admin.component.html',
  styleUrls: ['./restaurants-admin.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule, // <----- ¡Esto es lo que te falta!
    MatSnackBarModule
    ]
})
export class RestaurantsAdminComponent implements OnInit {
  restaurantes: any[] = [];
  filteredRestaurantes: any[] = [];
  page: number = 0;
  size: number = 10;
  sort: string = 'nombre';
  dir: 'asc' | 'desc' = 'asc';
  totalPages: number = 0;
  searchForm: FormGroup;

  editingRestaurante: any = null;
  editForm: FormGroup;

  constructor(
    private restaurantService: RestaurantService,
    private fb: FormBuilder,
  private snackBar: MatSnackBar
  ) {
    this.searchForm = this.fb.group({
      search: [''],
    });
    this.editForm = this.fb.group({
      nombre: [''],
      direccion: [''],
      // Más campos según tu modelo si hace falta
    });
  }

  ngOnInit(): void {
    this.loadRestaurantes();
    this.searchForm.get('search')?.valueChanges.subscribe(value => {
      this.applyFilter(value);
    });
  }

  loadRestaurantes() {
    this.restaurantService.fetchRestaurants(this.page, this.size, this.sort, this.dir)
      .subscribe(data => {
        this.restaurantes = data.content;
        this.filteredRestaurantes = data.content;
        this.totalPages = data.totalPages;
      });
  }

  applyFilter(value: string) {
    if (!value) {
      this.filteredRestaurantes = this.restaurantes;
      return;
    }
    const searchVal = value.toLowerCase();
    this.filteredRestaurantes = this.restaurantes.filter(r =>
      (r.nombre && r.nombre.toLowerCase().includes(searchVal)) ||
      (r.direccion && r.direccion.toLowerCase().includes(searchVal))
    );
  }
borrarRestaurante(id: number) {
  this.restaurantService.deleteRestaurant(id).subscribe({
    next: () => {
      // Quita el restaurante borrado de ambos arrays locales
      this.restaurantes = this.restaurantes.filter(r => r.id !== id);
      this.filteredRestaurantes = this.filteredRestaurantes.filter(r => r.id !== id);

      this.snackBar.open('Restaurante eliminado correctamente', 'Cerrar', { duration: 2000 });
    },
    error: err => {
      let mensaje = 'Error eliminando restaurante: ';
      if (err?.error?.message) {
        mensaje += err.error.message;
      } else if (typeof err?.error === 'string') {
        mensaje += err.error;
      } else if (err.status === 0) {
        mensaje += 'No hay conexión con el servidor.';
      } else if (err.status === 204) {
        // Si es 204, borra igual
        this.restaurantes = this.restaurantes.filter(r => r.id !== id);
        this.filteredRestaurantes = this.filteredRestaurantes.filter(r => r.id !== id);
        this.snackBar.open('Restaurante eliminado correctamente', 'Cerrar', { duration: 2000 });
        return;
      } else if (err.statusText) {
        mensaje += err.statusText;
      } else {
        mensaje += JSON.stringify(err);
      }
      this.snackBar.open(mensaje, 'Cerrar', { duration: 3000 });
    }
  });
}



  iniciarEdicion(restaurante: any) {
    this.editingRestaurante = restaurante;
    this.editForm.patchValue({
      nombre: restaurante.nombre,
      direccion: restaurante.direccion,
      // Más campos si necesitas
    });
  }

  cancelarEdicion() {
    this.editingRestaurante = null;
    this.editForm.reset();
  }

  guardarEdicion() {
    const updated = { ...this.editingRestaurante, ...this.editForm.value };
    this.restaurantService.updateRestaurant(this.editingRestaurante.id, updated).subscribe({
      next: () => {
        this.loadRestaurantes();
        this.cancelarEdicion();
      },
      error: err => alert('Error editando restaurante: ' + err.error)
    });
  }

  paginaAnterior() {
    if (this.page > 0) {
      this.page--;
      this.loadRestaurantes();
    }
  }

  siguientePagina() {
    if (this.page < this.totalPages - 1) {
      this.page++;
      this.loadRestaurantes();
    }
  }
}
