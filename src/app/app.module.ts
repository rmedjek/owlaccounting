import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';

import { AlertComponent } from './_directives';
import { LoginComponent } from './login';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AlertService, AuthenticationService, LogTrackService } from './_services';
import { HomeComponent } from './home';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthGuard } from './_guards';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
    MatButtonModule, MatCardModule, MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule, MatProgressSpinnerModule,
    MatSidenavModule, MatSnackBarModule,
    MatToolbarModule
} from '@angular/material';
import { RegisterComponent } from './register';
import { UserService } from './_services';
import { SidebarMenuComponent } from './sidebar-menu/sidebar-menu.component';
import { UserAccountsComponent } from './user-accounts/user-accounts.component';
import { LogsPageComponent } from './logs-page/logs-page.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { DropdownUserRolesComponent } from './dropdown-user-roles/dropdown-user-roles.component';
import { TolowerCaseDirective } from './_directives/tolowercase.directive';
import {ErrorInterceptor, JwtInterceptor} from './_helpers';
import { ForgotPasswordComponent } from './login/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './login/reset-password/reset-password.component';

@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatButtonModule,
        MatExpansionModule,
        MatInputModule,
        MatCardModule,
        MatToolbarModule,
        MatSidenavModule,
        MatListModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
    ],
  declarations: [
    AppComponent,
    AlertComponent,
    LoginComponent,
    HomeComponent,
    RegisterComponent,
    SidebarMenuComponent,
    UserAccountsComponent,
    LogsPageComponent,
    CreateUserComponent,
    DropdownUserRolesComponent,
    TolowerCaseDirective,
    ForgotPasswordComponent,
    ResetPasswordComponent
  ],
  providers: [
    AlertService,
    AuthenticationService,
    UserService,
    LogTrackService,
    AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
