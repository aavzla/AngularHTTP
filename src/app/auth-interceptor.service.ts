import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler
} from '@angular/common/http';
import { Injectable } from '@angular/core';

//We are modifying the provider's array on the app.module.ts, we don't need the injectable decorator.
//I added the Injectable decorator to avoid breaking and to support non-previewable scenarios in the future.
@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    //To display the functionality of the interceptor, we log the request.
    console.log(this.constructor.name + ' - Request is on its way.', req);

    //The HttpHandler with his method handle will allow the HttpRequest to continue it's flow to exit the application, make the Http call.
    //It is very important to have this in order to avoid any interruption on the calls.
    return next.handle(req);
  }
}
