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
    MatDatepickerModule, MatDialogModule,
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
import { SidebarMenuComponent } from './home/sidebar-menu/sidebar-menu.component';
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
import { UpdateAccountComponent } from './accounts/edit-account/update-account.component';
import { JournalizeComponent } from './journalize/journalize.component';
import { JournalEntryService } from './_services/journal-entry.service';
import { SystemAlertsForUsersService } from './_services/system-alerts-for-users.service';
import { LedgerService } from './_services/ledger.service';
import { LedgerAccountTransactionsComponent } from './ledger-account-transactions/ledger-account-transactions.component';
import { DataTableModule } from 'angular-6-datatable';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ToastrModule } from 'ngx-toastr';
import { ToasterService } from './_services/toast.service';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { TrialBalanceComponent } from './view-statements/trial-balance/trial-balance.component';
import { BsDropdownModule } from 'ngx-bootstrap';
import { RetainedEarningsComponent } from './view-statements/retained-earnings/retained-earnings.component';
import { IncomeStatementComponent } from './view-statements/income-statement/income-statement.component';
import { BalanceSheetComponent } from './view-statements/balance-sheet/balance-sheet.component';
import { ChartsModule } from 'ng2-charts';
import { MinusSignToParens } from './_helpers/minus.sign.to.parens';

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
        FlexLayoutModule,
        MatDialogModule,
        ChartsModule,
        Ng4LoadingSpinnerModule.forRoot(),
        ToastrModule.forRoot(),
        BsDropdownModule.forRoot()
    ],
    // exports: [
    //   MinusSignToParens,
    // ],
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
    LedgerAccountTransactionsComponent,
    TrialBalanceComponent,
    RetainedEarningsComponent,
    IncomeStatementComponent,
    BalanceSheetComponent,
    MinusSignToParens
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
    LedgerService,
    ToasterService,
      MinusSignToParens,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
