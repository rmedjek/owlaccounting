import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { routing } from './app.routing';

import { AlertComponent } from './_directives';
import { LoginComponent } from './login';
import { HttpClientModule} from '@angular/common/http';
import { AlertService, AuthenticationService } from './_services';
import {HomeComponent} from './home';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    routing,

  ],
  declarations: [
    AppComponent,
    AlertComponent,
    LoginComponent,
    HomeComponent
  ],
  providers: [
    AlertService,
    AuthenticationService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
