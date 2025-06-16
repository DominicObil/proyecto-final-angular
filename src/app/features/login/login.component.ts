import { Component } from '@angular/core';
import { AuthService } from '../../../app/core/services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username = '';
  password = '';
  error: string | null = null;
  showPassword = false;

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    this.auth.login(this.username, this.password).subscribe({
      next: (res) => {
        this.auth.setToken(res.token);

        const role = this.auth.getUserRole(); // 👈 Asegúrate de que este método existe

        // Redirigir según el rol
        if (role === 'ADMIN') {
          this.router.navigate(['/panel-solicitudes']);
        } else if (role === 'OWNER') {
          this.router.navigate(['/mis-restaurantes']);
        } else {
          this.router.navigate(['/restaurants']);
        }
      },
      error: () => {
        this.error = 'Usuario y contraseña inválido';
      }
    });
  }
}
