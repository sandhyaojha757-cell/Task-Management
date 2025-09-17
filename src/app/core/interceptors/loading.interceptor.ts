import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoadingService } from '../services/loading.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loader: LoadingService = inject(LoadingService);
  loader.show();
  return next(req).pipe(finalize(() => loader.hide()));
};
