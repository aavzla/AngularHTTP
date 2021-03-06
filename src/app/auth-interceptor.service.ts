import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  //HttpEventType
} from '@angular/common/http';
import { Injectable } from '@angular/core';
//import { tap } from 'rxjs/operators';

//We are modifying the provider's array on the app.module.ts, we don't need the injectable decorator.
//I added the Injectable decorator to avoid breaking and to support non-previewable scenarios in the future.
@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    //To display the functionality of the interceptor, we log the request.
    //console.log(this.constructor.name + ' - Request is on its way.', req);

    //We log the original request URL.
    //console.log(this.constructor.name + ' - Request URL.', req.url);

    //We modify the HttpRequest to append the key-value to the header.
    //The 'Auth' and 'xyz' does nothing regarding Authentication, this is to prove that we can modify the header.
    const modifiedRequest = req.clone({
      headers: req.headers.append('Auth', 'xyz')
    });

    //The HttpHandler with his method handle will allow the HttpRequest to continue it's flow to exit the application, make the Http call.
    //It is very important to have this in order to avoid any interruption on the calls.
    return next.handle(modifiedRequest)
      //.pipe(
      //  //Tap gives us access to the HttpResponse without modifying it.
      //  tap(
      //  event => {
      //    console.log(this.constructor.name + ' - HttpResponse event.', event);
      //    if (event.type === HttpEventType.Response) {
      //      console.log(this.constructor.name + ' - HttpResponse event Response body.', event.body);
      //    }
      //  }
      //))
      ;
  }
}
