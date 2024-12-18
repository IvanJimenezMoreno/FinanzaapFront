import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  user = {
    nombre: '',
    nombre_usuario: '',
    email: '',
    password: '',
    password_confirmation: ''
  };

  mensaje = '';

  constructor(private authService: AuthService, private fb: FormBuilder, private router: Router) {}
  

  onSubmit() {
    this.authService.register(this.user).subscribe(
      response =>{
        console.log('usuario registrado:', response);
        this.mensaje = 'Usuario registrado correctamente. Rediriendo a la página de inicio...';
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1500);

      },
      error => console.log(error)
    );
  }
}
