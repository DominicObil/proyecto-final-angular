import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RegisterService } from '../../../core/services/register.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  error: string | null = null;
  success: string | null = null;

  constructor(private fb: FormBuilder, private registerService: RegisterService) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4)]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      image: ['']
    });
  }

  onSubmit() {
    this.success = null;
    this.error = null;

    if (this.registerForm.invalid) {
      this.error = 'Todos los campos obligatorios deben estar rellenos';
      return;
    }

    this.loading = true;

    this.registerService.register(this.registerForm.value).subscribe({
      next: () => {
        this.success = '¡Usuario registrado correctamente!';
        this.registerForm.reset();
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.error('Error completo:', err);

        // Manejo seguro del error
        if (typeof err.error === 'string') {
          this.error = err.error;
        } else if (err.error?.message) {
          this.error = err.error.message;
        } else if (err.error?.error) {
          this.error = err.error.error;
        } else {
          this.error = 'Error desconocido al registrar';
        }
      }
    });
  }
}
