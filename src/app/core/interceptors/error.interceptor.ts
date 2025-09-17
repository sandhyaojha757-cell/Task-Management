import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snack = inject(MatSnackBar);
  return next(req).pipe(
    catchError((err: unknown) => {
      let message = 'An unexpected error occurred.';
      if (err instanceof HttpErrorResponse) {
        message = err.error?.message || err.message || message;
      }
      snack.open(message, 'Dismiss', { duration: 4000 });
      return throwError(() => err);
    })
  );
};
