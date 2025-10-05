import { HttpInterceptorFn } from '@angular/common/http';

export const loginInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};
