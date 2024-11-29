import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8000/api/';
  public isAdmin: boolean = false;

  constructor(private http: HttpClient) { }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}registro`, userData);
  }
  
  login(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}login`, userData);
  }

  setAdminStatus(isAdmin: boolean): void {
    this.isAdmin = isAdmin;
  }

  
}