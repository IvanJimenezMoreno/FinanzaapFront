import { Component, OnInit } from '@angular/core';
import { MovimientoService } from '../service/movimiento.service';
import { Router } from '@angular/router';
import { ChartType } from 'angular-google-charts';

@Component({
  selector: 'app-movimientos',
  templateUrl: './movimientos.component.html',
  styleUrls: ['./movimientos.component.css']
})
export class MovimientosComponent implements OnInit {
  public chartData: any[] = [];
  public chartOptions = {
    title: 'Movimientos',
    showRowNumber: true,
    width: '100%',
    height: '100%'
  };
  public chartType: ChartType = ChartType.Table;
  public chartColumns = ['Fecha', 'Tipo', 'Monto', 'Notas'];
  public totalIngresos: number = 0;
  public totalGastos: number = 0;
  public balance: number = 0;

  constructor(private movimientoService: MovimientoService, private router: Router) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    const token = localStorage.getItem('token');
    this.movimientoService.obtenerMovimientos(token).subscribe(response => {
      if (Array.isArray(response)) {
        this.chartData = this.procesarDatos(response);
      } else {
        console.error('La respuesta del servidor no es un array de movimientos:', response);
      }
    });
  }

  procesarDatos(movimientosPorMes: any[]): any[] {
    const datos: any[] = [];
    this.totalIngresos = 0;
    this.totalGastos = 0;

    movimientosPorMes.forEach(mesData => {
      const movimientos = mesData.movimientos;

      if (Array.isArray(movimientos)) {
        movimientos.forEach(movimiento => {
          if (movimiento && movimiento.fecha) {
            const fecha = new Date(movimiento.fecha);
            if (!isNaN(fecha.getTime())) {
              const monto = parseFloat(movimiento.monto) || 0;
              datos.push([
                fecha.toLocaleString('default', { day: 'numeric', month: 'long', year: 'numeric' }),
                movimiento.tipo,
                monto,
                movimiento.notas || ''
              ]);

              if (movimiento.tipo === 'ingreso') {
                this.totalIngresos += monto;
              } else if (movimiento.tipo === 'gasto') {
                this.totalGastos += monto;
              }
            } else {
              console.error('Fecha inválida:', movimiento.fecha);
            }
          } else {
            console.error('Movimiento o fecha inválida:', movimiento);
          }
        });
      } else {
        console.error('Movimientos no es un array:', movimientos);
      }
    });

    this.balance = this.totalIngresos - this.totalGastos;
    console.log('Datos procesados:', datos);
    return datos;
  }

  cerrarSesion(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
