import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage {
  email = '';
  password = '';
  cargando = false;

  constructor(private router: Router, private auth: AuthService) { }

  iniciarSesion() {
    const emailLimpio = this.email ? this.email.trim().toLowerCase() : '';
    const passwordLimpia = this.password ? this.password.trim() : '';

    if (emailLimpio && passwordLimpia) {
      this.cargando = true;

      this.auth.login({ email: emailLimpio, password: passwordLimpia }).subscribe({
        next: (respuesta: any) => {
          console.log('Login exitoso', respuesta);
          this.cargando = false;
          this.router.navigate(['/tabs/tab1']);
        },
        error: (error: any) => {
          console.error('Error de login', error);
          this.cargando = false;
          if (error.status === 0) {
            alert('No se pudo conectar con el servidor. Verifica que php artisan serve esté corriendo.');
          } else {
            alert('Correo o contraseña incorrectos');
          }
        }
      });
    }
  }
}