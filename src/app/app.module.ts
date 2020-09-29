import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
//Imported from the angular common http.
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AuthInterceptorService } from './auth-interceptor.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    FormsModule,
    //The HttpClientModule was added to allow Angular handling of HTTP communications.
    HttpClientModule
  ],
  providers: [
    {
      //Identifier of the Interceptors.
      //This must be place for all interceptors as this is the key to identify them.
      provide: HTTP_INTERCEPTORS,
      //Interceptor Service registration
      useClass: AuthInterceptorService,
      //Identification that more than one Interceptor could be live, avoid replacements.
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
