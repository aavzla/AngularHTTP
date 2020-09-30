import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpEventType
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

//This interceptor was created using the CLI command for create a service.

//We are modifying the provider's array on the app.module.ts, we don't need the injectable decorator.
//I added the Injectable decorator to avoid breaking and to support non-previewable scenarios in the future.
@Injectable({
  providedIn: 'root'
})
export class LoggingInterceptorService implements HttpInterceptor {

  constructor() { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //To display the functionality of the interceptor, we log the request.
    console.log(this.constructor.name + ' - Request is on its way.', req);

    //We log the original request URL.
    console.log(this.constructor.name + ' - Request URL.', req.url);

    //The HttpHandler with his method handle will allow the HttpRequest to continue it's flow to exit the application, make the Http call.
    //It is very important to have this in order to avoid any interruption on the calls.
    return next.handle(req)
      .pipe(
        //Tap gives us access to the HttpResponse without modifying it.
        tap(
          event => {
            console.log(this.constructor.name + ' - HttpResponse event.', event);
            if (event.type === HttpEventType.Response) {
              console.log(this.constructor.name + ' - HttpResponse event Response body.', event.body);
            }
          }
      ));
  }
}
