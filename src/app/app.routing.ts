import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login';
import { HomeComponent } from './home';
import { AuthGuard } from './_guards';
import { RegisterComponent } from './auth/register';
import { CreateUserComponent } from './users/create-user/create-user.component';
import { UserAccountsComponent } from './users/user-accounts/user-accounts.component';
import { LogsPageComponent } from './logs-page/logs-page.component';
import { ChartOfAccountsComponent } from './accounts/chart-of-accounts.component';
import { CreateNewAccountComponent } from './accounts/create-new-account/create-new-account.component';
import { AccountViewComponent } from './accounts/account-view/account-view.component';
import { EditAccountResolverService } from './_services/edit-account-resolver-service';
import { UpdateAccountComponent } from './accounts/update-account/update-account.component';

const appRoutes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'userAccounts', component: UserAccountsComponent },
    { path: 'createUser', component: CreateUserComponent },
    { path: 'logsPage', component: LogsPageComponent},
    { path: 'accounts', component: ChartOfAccountsComponent},
    { path: 'createNewAccount', component: CreateNewAccountComponent},
    { path: 'accounts/:id', component: CreateNewAccountComponent, canActivate: [AuthGuard], resolve: {
        account: EditAccountResolverService }},
    { path: 'accounts/edit/:id', component: UpdateAccountComponent, canActivate: [AuthGuard], resolve: {
            account: EditAccountResolverService }},
    { path: 'accounts/:id/view', component: AccountViewComponent, canActivate: [AuthGuard], resolve: {
        account: EditAccountResolverService}},

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const AppRoutingModule = RouterModule.forRoot(appRoutes);
