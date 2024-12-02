import { Component, OnInit } from '@angular/core';
import { AdminService } from '../service/admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  usuarios: any[] = [];
  usuario: any = {
    nombre: '',
    nombre_usuario: '',
    email: '',
    password: '',
    password_confirmation: '',
    is_admin: false
  };
  mensaje = '';
  errorMensaje = '';
  token: string | null = '';
  editMode: boolean = false;
  usuarioId: number | null = null;
  busqueda: string = '';

  constructor(private adminService: AdminService, private router: Router) { }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.listarUsuarios();
  }

  listarUsuarios(): void {
    if (this.token) {
      this.adminService.getUsuarios(this.token).subscribe(
        response => {
          this.usuarios = response;
        },
        error => {
          console.error('Error al listar usuarios', error);
        }
      );
    }
  }

  buscarUsuarios(): void {
    if (this.token && this.busqueda.trim() !== '') {
      this.adminService.buscarUsuarios(this.busqueda, this.token).subscribe(
        response => {
          this.usuarios = response;
          this.errorMensaje = '';
        },
        error => {
          console.error('Error al buscar usuarios', error);
          this.errorMensaje = error.error.message || 'Error al buscar usuarios';
        }
      );
    } else {
      this.listarUsuarios();
    }
  }

  crearUsuario(): void {
    if (this.token) {
      this.adminService.createUsuario(this.usuario, this.token).subscribe(
        response => {
          this.mensaje = 'Usuario creado exitosamente';
          this.limpiarFormulario();
          this.listarUsuarios();
        },
        error => {
          console.error('Error al crear usuario', error);
        }
      );
    }
  }

  actualizarUsuario(): void {
    if (this.token && this.usuarioId !== null) {
      this.adminService.updateUsuario(this.usuarioId, this.usuario, this.token).subscribe(
        response => {
          this.mensaje = 'Usuario actualizado exitosamente';
          this.limpiarFormulario();
          this.listarUsuarios();
        },
        error => {
          console.error('Error al actualizar usuario', error);
        }
      );
    }
  }

  eliminarUsuario(id: number): void {
    if (this.token) {
      this.adminService.deleteUsuario(id, this.token).subscribe(
        response => {
          this.mensaje = 'Usuario eliminado exitosamente';
          this.listarUsuarios();
        },
        error => {
          console.error('Error al eliminar usuario', error);
        }
      );
    }
  }

  seleccionarUsuario(usuario: any): void {
    this.usuario = { ...usuario, password: '', password_confirmation: '' };
    this.usuarioId = usuario.id;
    this.editMode = true;
  }

  limpiarFormulario(): void {
    this.usuario = {
      nombre: '',
      nombre_usuario: '',
      email: '',
      password: '',
      password_confirmation: '',
      is_admin: false
    };
    this.usuarioId = null;
    this.editMode = false;
    this.mensaje = '';
    this.errorMensaje = '';
  }

  cerrarSesion(): void {
    localStorage.clear();
    this.token = null;
    this.usuarios = [];
    this.router.navigate(['/']);
    

  }
}
