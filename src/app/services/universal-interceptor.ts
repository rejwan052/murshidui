import {Injectable} from '@angular/core';
import {HttpInterceptor, HttpEvent, HttpHandler, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class UniversalInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req);
  }
}
