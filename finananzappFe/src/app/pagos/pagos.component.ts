import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PagoService } from '../service/pago.service';
import { IngresoService } from '../service/ingreso.service';

@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.css']
})
export class PagosComponent implements OnInit {
  pagos: any[] = [];
  ingresos: any[] = [];
  pago = {
    nombre_pago: '',
    fecha_pago: '',
    monto_pago: null,
    estado_pago: false,
    recordatorio_activado: false,
    descripcion: ''
  };
  ingreso = {
    nombre: '',
    fecha: '',
    monto_ingreso: null,
    descripcion: ''
  };
  mostrarFormularioPago = false;
  mostrarFormularioIngreso = false;

  constructor(private pagoService: PagoService, private ingresoService: IngresoService, private router: Router) { }

  ngOnInit(): void {
    this.obtenerPagos();
    this.obtenerIngresos();
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

  obtenerIngresos(): void {
    const token = localStorage.getItem('token');
    this.ingresoService.obtenerIngresos(token).subscribe(
      response => {
        this.ingresos = response;
      },
      error => {
        console.error('Error al obtener los ingresos:', error);
      }
    );
  }

  onSubmitPago(): void {
    const token = localStorage.getItem('token');
    this.pagoService.crearPago(this.pago, token).subscribe(
      response => {
        this.pagos.push(response);
        this.mostrarFormularioPago = false;
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

  onSubmitIngreso(): void {
    const token = localStorage.getItem('token');
    this.ingresoService.crearIngreso(this.ingreso, token).subscribe(
      response => {
        this.ingresos.push(response);
        this.mostrarFormularioIngreso = false;
        this.ingreso = {
          nombre: '',
          fecha: '',
          monto_ingreso: null,
          descripcion: ''
        };
      },
      error => {
        console.error('Error al crear el ingreso:', error);
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

  borrarPago(id_pago: number): void {
    const token = localStorage.getItem('token');
    this.pagoService.borrarPago(id_pago, token).subscribe(
      response => {
        this.pagos = this.pagos.filter(p => p.id_pago !== id_pago);
      },
      error => {
        console.error('Error al borrar el pago:', error);
      }
    );
  }

  borrarIngreso(id_ingreso: number): void {
    const token = localStorage.getItem('token');
    this.ingresoService.borrarIngreso(id_ingreso, token).subscribe(
      response => {
        this.ingresos = this.ingresos.filter(i => i.id_ingreso !== id_ingreso);
      },
      error => {
        console.error('Error al borrar el ingreso:', error);
      }
    );
  }

  cerrarSesion(): void {
    localStorage.removeItem('token');
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
