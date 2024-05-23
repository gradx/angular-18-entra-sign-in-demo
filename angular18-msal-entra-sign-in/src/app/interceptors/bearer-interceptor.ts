import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
  
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthStoreProvider } from '../signal-stores/auth-store';


@Injectable()
export class BearerInterceptor implements HttpInterceptor {
    constructor(
        private injector: Injector,
        private router: Router
      ) {}
    
      intercept(
        req: HttpRequest<any>, 
        next: HttpHandler
      ): Observable<HttpEvent<any>> {
    
        const authService = this.injector.get(AuthStoreProvider);
        const authToken = authService.getToken() ?? '';

        const authReq = req.clone({
            setHeaders: {
              Authorization: 'Bearer ' + authToken
            }
          });


        return next.handle(authReq);
    }
}