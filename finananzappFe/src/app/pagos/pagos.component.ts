import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PagoService } from '../service/pago.service';

@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.css']
})
export class PagosComponent implements OnInit {
  pagos: any[] = [];
  pago = {
    nombre_pago: '',
    fecha_pago: '',
    monto_pago: null,
    estado_pago: false,
    recordatorio_activado: false,
    descripcion: ''
  };
  mostrarFormulario = false;

  constructor(private pagoService: PagoService, private router: Router) { }

  ngOnInit(): void {
    this.obtenerPagos();
  }

  obtenerPagos(): void {
    const token = localStorage.getItem('token');
    this.pagoService.obtenerPagos(token).subscribe(
      response => {
        this.pagos = response;
      },
      error => {
        console.error('Error al obtener los pagos:', error);
      }
    );
  }

  onSubmit(): void {
    const token = localStorage.getItem('token');
    this.pagoService.crearPago(this.pago, token).subscribe(
      response => {
        this.pagos.push(response);
        this.mostrarFormulario = false;
        this.pago = {
          nombre_pago: '',
          fecha_pago: '',
          monto_pago: null,
          estado_pago: false,
          recordatorio_activado: false,
          descripcion: ''
        };
      },
      error => {
        console.error('Error al crear el pago:', error);
      }
    );
  }

  pagar(id_pago: number): void {
    const token = localStorage.getItem('token');
    this.pagoService.actualizarEstadoPago(id_pago, true, token).subscribe(
      response => {
        const pago = this.pagos.find(p => p.id_pago === id_pago);
        if (pago) {
          pago.estado_pago = true;
        }
      },
      error => {
        console.error('Error al actualizar el estado del pago:', error);
      }
    );
  }

  cerrarSesion(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
