import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const detail: string = error.error?.detail ?? error.error?.message ?? null;

      switch (error.status) {
        case 401:
          toast.error('Sesión expirada. Inicia sesión de nuevo.');
          auth.logout();
          break;
        case 400:
          toast.error(detail ?? 'Solicitud inválida. Verifica los datos.');
          break;
        case 404:
          toast.error(detail ?? 'Recurso no encontrado.');
          break;
        case 409:
          toast.error(detail ?? 'Conflicto: stock insuficiente o carrito vacío.');
          break;
        case 500:
        default:
          toast.error('Error inesperado. Intenta de nuevo.');
          break;
      }

      return throwError(() => error);
    })
  );
};
