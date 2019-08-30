import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { routing } from './app.routing';

import { AlertComponent } from './_directives';
import { LoginComponent } from './login';
import { HttpClientModule} from '@angular/common/http';
import { AlertService, AuthenticationService } from './_services';
import { HomeComponent } from './home';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthGuard } from './_guards';

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
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
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
