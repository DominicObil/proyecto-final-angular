import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  menuOpen = false;
  userRole: string | null = null;

  private subscription: Subscription | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.subscription = this.authService.isLoggedIn().subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
      if (loggedIn) {
        this.userRole = this.authService.getUserRole(); // <- asegúrate de que este método existe
      } else {
        this.userRole = null;
      }
    });
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  logout() {
    this.authService.logout();
    this.closeMenu();
    this.router.navigate(['/login']);
  }

  irALogin() {
    this.router.navigate(['/login']);
  }

  irARegistro() {
    this.router.navigate(['/register']);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}