import { Component } from '@angular/core';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.css'
})
export class PrincipalComponent {
  usuario: any;

  constructor() {}

  ngOnInit(): void {
    const usuario = localStorage.getItem('user');
    if (usuario) {
      this.usuario = JSON.parse(usuario);
    }
    
  }
}
