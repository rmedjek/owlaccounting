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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatFormFieldModule } from '@angular/material';

@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        routing,
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatButtonModule

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
