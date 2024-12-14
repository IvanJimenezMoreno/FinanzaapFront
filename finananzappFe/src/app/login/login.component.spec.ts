import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../service/auth.service';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [HttpClientTestingModule, FormsModule, RouterTestingModule],
      providers: [AuthService]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería iniciar sesión correctamente', () => {
    const usuarioMock = { email: 'test@example.com', password: 'password' };
    const respuestaMock = {
      user: { email: 'test@example.com', is_admin: false },
      access_token: 'fake-jwt-token'
    };

    spyOn(authService, 'login').and.returnValue(of(respuestaMock));
   

    component.user = usuarioMock;
    component.onSubmit();

    expect(authService.login).toHaveBeenCalledWith(usuarioMock);
    expect(localStorage.getItem('usuario')).toEqual(JSON.stringify(respuestaMock.user));
    expect(localStorage.getItem('token')).toEqual(respuestaMock.access_token);
    expect(localStorage.getItem('admin')).toEqual(respuestaMock.user.is_admin.toString());
    expect(component.mensaje).toBe('Inicio de sesión exitoso. Redirigiendo al inicio...');
    
  });

  it('debería manejar el error al iniciar sesión', () => {
    const usuarioMock = { email: 'test@example.com', password: 'password' };
    const errorMock = { error: 'Error en el inicio de sesión' };

    spyOn(authService, 'login').and.returnValue(throwError(errorMock));

    component.user = usuarioMock;
    component.onSubmit();

    expect(authService.login).toHaveBeenCalledWith(usuarioMock);
    expect(component.mensaje).toBe('Error en el inicio de sesión. Por favor, verifica tus credenciales.');
  });
});
