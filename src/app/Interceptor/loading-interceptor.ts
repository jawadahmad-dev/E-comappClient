import { HttpInterceptorFn } from '@angular/common/http';
import { Loading } from '../Services/loading';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(Loading);

  Promise.resolve().then(() => loadingService.show());

  return next(req).pipe(
    finalize(() => {
      Promise.resolve().then(() => loadingService.hide());
    }),
  );
};
