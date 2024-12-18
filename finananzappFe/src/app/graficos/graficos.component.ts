import { Component, OnInit } from '@angular/core';
import { MovimientoService } from '../service/movimiento.service';
import { Router } from '@angular/router';
import { ChartType } from 'angular-google-charts';

@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.component.html',
  styleUrls: ['./graficos.component.css']
})
export class GraficosComponent implements OnInit {
  public chartData: any[] = [];
  public chartOptions = {
    title: 'Ingresos y Gastos Mensuales',
    hAxis: { title: 'Mes' },
    vAxis: { title: 'Cantidad en euros' },
    seriesType: 'bars',
    series: {
      0: { type: 'bars', color: 'blue' },
      1: { type: 'bars', color: 'red' }
    },
    bar: { groupWidth: '75%' },
    chartArea: { width: '80%', height: '70%' },
    responsive: true
  };
  public chartType: ChartType = ChartType.ComboChart;
  public chartColumns = ['Mes', 'Ingresos', 'Gastos'];

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
    const datosPorMes: any = {};

    movimientosPorMes.forEach(mesData => {
      const mes = mesData.mes;
      const movimientos = mesData.movimientos;

      if (Array.isArray(movimientos)) {
        movimientos.forEach(movimiento => {
          if (movimiento && movimiento.fecha) {
            const fecha = new Date(movimiento.fecha);
            if (!isNaN(fecha.getTime())) {
              const mesFormateado = fecha.toLocaleString('default', { month: 'long', year: 'numeric' });
              if (!datosPorMes[mesFormateado]) {
                datosPorMes[mesFormateado] = { ingresos: 0, gastos: 0 };
              }
              if (movimiento.tipo === 'ingreso') {
                datosPorMes[mesFormateado].ingresos += parseFloat(movimiento.monto) || 0;
              } else if (movimiento.tipo === 'gasto') {
                datosPorMes[mesFormateado].gastos += parseFloat(movimiento.monto) || 0;
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

    console.log('Datos procesados:', datosPorMes);

    // Ordenar los meses cronológicamente de manera ascendente
    const mesesOrdenados = Object.keys(datosPorMes).sort((a, b) => {
      const fechaA = new Date(a);
      const fechaB = new Date(b);
      return fechaA.getTime() - fechaB.getTime();
    });

    return mesesOrdenados.map(mes => [
      mes,
      datosPorMes[mes].ingresos,
      datosPorMes[mes].gastos
    ]);
  }

  cerrarSesion(): void {
    localStorage.clear();
    this.router.navigate(['/']);
  }
}