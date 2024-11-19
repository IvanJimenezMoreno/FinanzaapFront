import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PresupuestoService {
  private apiUrl = 'http://localhost:8000/api/presupuestos';

  constructor(private http: HttpClient) { }

  obtenerPresupuestos(token:any): Observable<any> {
     token = token;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(this.apiUrl, { headers });
  }

  crearPresupuesto(presupuesto: any, token:any): Observable<any> {
     token = token;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(this.apiUrl, presupuesto, { headers });
  }

  restarDinero(id_presupuesto: number, monto: number, token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(`${this.apiUrl}/${id_presupuesto}/restar`, { monto }, { headers });
  }

  borrarPresupuesto(id_presupuesto: number, token: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete(`${this.apiUrl}/${id_presupuesto}`, { headers });
  }
}