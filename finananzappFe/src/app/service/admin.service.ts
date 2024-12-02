import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private apiUrl = 'http://localhost:8000/api/admin/usuarios';

  constructor(private http: HttpClient) { }

  getUsuarios(token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(this.apiUrl, { headers });
  }

  getUsuario(id: number, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}/${id}`, { headers });
  }

  createUsuario(usuario: any, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(this.apiUrl, usuario, { headers });
  }

  updateUsuario(id: number, usuario: any, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const updateData = {
      nombre: usuario.nombre,
      nombre_usuario: usuario.nombre_usuario,
      email: usuario.email,
      is_admin: usuario.is_admin
    };
    return this.http.put(`${this.apiUrl}/${id}`, updateData, { headers });
  }

  deleteUsuario(id: number, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
  }

  buscarUsuarios(nombre: string, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}/buscar/${nombre}`, { headers });
  }
}
