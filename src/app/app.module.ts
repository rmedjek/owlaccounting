import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { routing } from './app.routing';

import { AlertComponent } from './_directives';
import { LoginComponent } from './login';
import { HttpClientModule} from '@angular/common/http';
import { AlertService, AuthenticationService, LogTrackService } from './_services';
import { HomeComponent } from './home';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthGuard } from './_guards';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule
} from '@angular/material';
import { RegisterComponent } from './register';
import { UserService } from './_services';
import { SidebarMenuComponent } from './sidebar-menu/sidebar-menu.component';
import { UserAccountsComponent } from './user-accounts/user-accounts.component';
import { LogsPageComponent } from './logs-page/logs-page.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { DropdownUserRolesComponent } from './dropdown-user-roles/dropdown-user-roles.component';

@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        routing,
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatButtonModule,
        MatInputModule,
        MatToolbarModule,
        MatSidenavModule,
        MatListModule,
        MatIconModule,
        FormsModule
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
    DropdownUserRolesComponent
  ],
  providers: [
    AlertService,
    AuthenticationService,
    UserService,
    LogTrackService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
