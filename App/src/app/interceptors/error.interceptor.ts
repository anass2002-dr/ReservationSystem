import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        if ([401, 403].includes(err.status) && this.authService.isLoggedIn()) {
          // Auto logout if 401 or 403 response returned from api
          this.authService.logout();
          
          // Show alert to user
          import('sweetalert2').then(Swal => {
            Swal.default.fire({
              title: 'Session Expired',
              text: 'Your session has expired. Please log in again.',
              icon: 'warning',
              confirmButtonText: 'OK'
            });
          });
        }
        return throwError(() => err);
      })
    );
  }
}
