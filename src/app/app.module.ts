import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';

import { AlertComponent } from './_directives';
import { LoginComponent } from './auth/login';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AlertService, AuthenticationService, LogTrackService } from './_services';
import { HomeComponent } from './home';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthGuard } from './_guards';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatDatepickerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatToolbarModule,
    MatTooltipModule
} from '@angular/material';
import { RegisterComponent } from './auth/register';
import { UserService } from './_services';
import { SidebarMenuComponent } from './sidebar-menu/sidebar-menu.component';
import { UserAccountsComponent } from './users/user-accounts/user-accounts.component';
import { LogsPageComponent } from './logs-page/logs-page.component';
import { CreateUserComponent } from './users/create-user/create-user.component';
import { DropdownUserRolesComponent } from './users/dropdown-user-roles/dropdown-user-roles.component';
import { TolowerCaseDirective } from './_directives/tolowercase.directive';
import { ErrorInterceptor, JwtInterceptor } from './_helpers';
import { ChartOfAccountsService } from './_services/chart-of-accounts.service';
import { ChartOfAccountsComponent } from './accounts/chart-of-accounts.component';
import { AccountTypeSelectorComponent } from './accounts/account-type-selector/account-type-selector.component';
import { CreateNewAccountComponent } from './accounts/create-new-account/create-new-account.component';
import { AccountViewComponent } from './accounts/account-view/account-view.component';
import { RouterModule } from '@angular/router';
import { JwtService } from './_services/jwt.service';
import { EditAccountResolverService } from './_services/edit-account-resolver-service';
import { UpdateAccountComponent } from './accounts/update-account/update-account.component';
import { JournalizeComponent } from './journalize/journalize.component';
import { JournalEntryService } from './_services/journal-entry.service';
import { SystemAlertsForUsersService } from './_services/system-alerts-for-users.service';
import { LedgerAccountTransactionsComponent } from './ledger-account-transactions/ledger-account-transactions.component';
import { DataTableModule } from 'angular-6-datatable';
import { FlexLayoutModule } from '@angular/flex-layout';


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
        MatTableModule,
        MatProgressSpinnerModule,
        MatProgressBarModule,
        MatSortModule,
        MatMenuModule,
        MatPaginatorModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatTooltipModule,
        MatRadioModule,
        MatSelectModule,
        MatSnackBarModule,
        MatSlideToggleModule,
        MatButtonToggleModule,
        RouterModule,
        DataTableModule,
        FlexLayoutModule
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
    AccountViewComponent,
    UpdateAccountComponent,
    JournalizeComponent,
    LedgerAccountTransactionsComponent
  ],
  providers: [
    AuthGuard,
    AlertService,
    AuthenticationService,
    UserService,
    LogTrackService,
    ChartOfAccountsService,
    MatDatepickerModule,
    JwtService,
    EditAccountResolverService,
    JournalEntryService,
    SystemAlertsForUsersService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
