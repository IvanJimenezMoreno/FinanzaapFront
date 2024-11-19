import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PresupuestoService } from '../service/presupuesto.service';

@Component({
  selector: 'app-presupuestos',
  templateUrl: './presupuestos.component.html',
  styleUrls: ['./presupuestos.component.css']
})
export class PresupuestosComponent implements OnInit {
  presupuestos: any[] = [];
  presupuesto = {
    monto_presupuesto: null,
    periodo: '',
    descripcion: ''
  };
  mostrarFormulario = false;
  mostrarInputGasto: { [key: number]: boolean } = {};
  montoGasto: { [key: number]: number } = {};
  idPresupuestoAEliminar: number | null = null;
  nombrePresupuestoAEliminar: string | null = null;
  mostrarModal = false;

  constructor(private presupuestoService: PresupuestoService, private router: Router) { }

  ngOnInit(): void {
    this.obtenerPresupuestos();
  }

  obtenerPresupuestos(): void {
    const token = localStorage.getItem('token');
    this.presupuestoService.obtenerPresupuestos(token).subscribe(
      response => {
        this.presupuestos = response;
        this.presupuestos.forEach(p => {
          const claveOriginal = `monto_presupuesto_original_${p.id_presupuesto}`;
          const valorOriginal = localStorage.getItem(claveOriginal);
          if (valorOriginal) {
            p.monto_presupuesto_original = parseFloat(valorOriginal);
          } else {
            p.monto_presupuesto_original = p.monto_presupuesto;
            localStorage.setItem(claveOriginal, p.monto_presupuesto_original.toString());
          }

          const claveActual = `monto_presupuesto_${p.id_presupuesto}`;
          const valorActual = localStorage.getItem(claveActual);
          if (valorActual) {
            p.monto_presupuesto = parseFloat(valorActual);
          } else {
            localStorage.setItem(claveActual, p.monto_presupuesto.toString());
          }
        });
      },
      error => {
        console.error('Error al obtener los presupuestos:', error);
      }
    );
  }

  onSubmit(): void {
    const token = localStorage.getItem('token');
    this.presupuestoService.crearPresupuesto(this.presupuesto, token).subscribe(
      response => {
        response.monto_presupuesto_original = response.monto_presupuesto;
        const claveOriginal = `monto_presupuesto_original_${response.id_presupuesto}`;
        localStorage.setItem(claveOriginal, response.monto_presupuesto_original.toString());
        const claveActual = `monto_presupuesto_${response.id_presupuesto}`;
        localStorage.setItem(claveActual, response.monto_presupuesto.toString());
        this.presupuestos.push(response);
        this.mostrarFormulario = false;
        this.presupuesto = {
          monto_presupuesto: null,
          periodo: '',
          descripcion: ''
        };
      },
      error => {
        console.error('Error al crear el presupuesto:', error);
      }
    );
  }

  restarDinero(id_presupuesto: number): void {
    const token = localStorage.getItem('token');
    const monto = this.montoGasto[id_presupuesto];
    const presupuesto = this.presupuestos.find(p => p.id_presupuesto === id_presupuesto);
    if (presupuesto) {
      presupuesto.monto_presupuesto -= monto;
      localStorage.setItem(`monto_presupuesto_${id_presupuesto}`, presupuesto.monto_presupuesto.toString());
      this.mostrarInputGasto[id_presupuesto] = false;
      this.montoGasto[id_presupuesto] = 0;
    }
  }

  confirmarBorrado(id_presupuesto: number, nombre_presupuesto: string): void {
    this.idPresupuestoAEliminar = id_presupuesto;
    this.nombrePresupuestoAEliminar = nombre_presupuesto;
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.idPresupuestoAEliminar = null;
    this.nombrePresupuestoAEliminar = null;
  }

  borrarPresupuestoConfirmado(): void {
    if (this.idPresupuestoAEliminar !== null) {
      const token = localStorage.getItem('token');
      this.presupuestoService.borrarPresupuesto(this.idPresupuestoAEliminar, token).subscribe(
        response => {
          this.presupuestos = this.presupuestos.filter(p => p.id_presupuesto !== this.idPresupuestoAEliminar);
          localStorage.removeItem(`monto_presupuesto_original_${this.idPresupuestoAEliminar}`);
          localStorage.removeItem(`monto_presupuesto_${this.idPresupuestoAEliminar}`);
          console.log(response.message);
          this.cerrarModal();
        },
        error => {
          console.error('Error al borrar el presupuesto:', error);
        }
      );
    }
  }

  calcularPorcentajeDisponible(presupuesto: any): number {
    const disponible = Math.max(presupuesto.monto_presupuesto, 0);
    return (disponible / presupuesto.monto_presupuesto_original) * 100;
  }

  calcularExceso(presupuesto: any): number {
    const exceso = presupuesto.monto_presupuesto - presupuesto.monto_presupuesto_original;
    return exceso < 0 ? Math.abs(exceso) : 0;
  }

  obtenerMontoPresupuesto(presupuesto: any): number {
    return Math.max(presupuesto.monto_presupuesto, 0);
  }

  obtenerTotalGastado(presupuesto: any): number {
    return presupuesto.monto_presupuesto_original - presupuesto.monto_presupuesto;
  }

  cerrarSesion(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}