import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.css'
})
export class PrincipalComponent {
  usuario: any;
  admin: any;
  token: string | null = '';

  constructor(private router:Router, public authService: AuthService) {}

  ngOnInit(): void {
    const usuario = localStorage.getItem('usuario');
    const admin = localStorage.getItem('admin');
    this.token = localStorage.getItem('token');
    

    
    if (usuario) {
      this.usuario = JSON.parse(usuario);
    }

    if (admin) {
      this.admin = JSON.parse(admin);
    }
    
  }

  cerraSesion() {
          localStorage.clear();
          this.usuario = null;
          console.log('Sesión cerrada correctamente:');
          this.router.navigate(['/']);
  }
}
