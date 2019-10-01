import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login';
import { HomeComponent } from './home';
import { AuthGuard } from './_guards';
import { RegisterComponent } from './register';
import { CreateUserComponent } from './create-user/create-user.component';
import { UserAccountsComponent } from './user-accounts/user-accounts.component';
import { LogsPageComponent } from './logs-page/logs-page.component';
import { ChartOfAccountsComponent } from './chart-of-accounts/chart-of-accounts.component';
import { CreateNewAccountComponent } from './chart-of-accounts/create-new-account/create-new-account.component';
import { AccountViewComponent } from './chart-of-accounts/account-view/account-view.component';
import { EditAccountResolverService } from './_services/edit-account-resolver-service';

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
        account: EditAccountResolverService
    }},
    { path: 'accounts/:id/view', component: AccountViewComponent, canActivate: [AuthGuard], resolve: {
        account: EditAccountResolverService}},

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const AppRoutingModule = RouterModule.forRoot(appRoutes);
