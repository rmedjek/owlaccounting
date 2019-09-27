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
    MatListModule, MatMenuModule, MatPaginatorModule, MatProgressSpinnerModule,
    MatSidenavModule, MatSortModule, MatTableModule,
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
import { ChartOfAccountsService } from './_services/chart-of-accounts.service';
import { ChartOfAccountsComponent } from './chart-of-accounts/chart-of-accounts.component';
import { AccountTypeSelectorComponent } from './chart-of-accounts/account-type-selector/account-type-selector.component';
import { CommonModule } from '@angular/common';
import { CreateNewAccountComponent } from './chart-of-accounts/create-new-account/create-new-account.component';
import { TwoDigitDecimaNumberDirective } from './_directives/decimalPlaces.directive';

@NgModule({
    imports: [CommonModule,
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
        MatTableModule,
        MatProgressSpinnerModule,
        MatSortModule,
        MatMenuModule,
        MatPaginatorModule
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
    ChartOfAccountsComponent,
    AccountTypeSelectorComponent,
    CreateNewAccountComponent,
    TwoDigitDecimaNumberDirective
  ],
  providers: [
    AuthGuard,
    AlertService,
    AuthenticationService,
    UserService,
    LogTrackService,
    ChartOfAccountsService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
