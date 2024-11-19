import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  user = {
    email: '',
    password: ''
  };

  mensaje = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.login(this.user).subscribe(
      response => {
        console.log('usuario autenticado:', response);
        localStorage.setItem('usuario', JSON.stringify(response.user));
        localStorage.setItem('token', response.access_token);
         this.mensaje = 'Inicio de sesión exitoso. Redirigiendo al inicio...';
         setTimeout(() => {
          this.router.navigate(['/principal']);
         }, 3000); // Redirigir después de 3 segundos
      },
      error => {
        console.error('Error en el inicio de sesión', error);
        this.mensaje = 'Error en el inicio de sesión. Por favor, verifica tus credenciales.';
      }
    );
  }
}