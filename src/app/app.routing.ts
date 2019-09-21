import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login';
import { HomeComponent } from './home';
import { AuthGuard } from './_guards';
import { RegisterComponent } from './register';
import { CreateUserComponent } from './create-user/create-user.component';
import { UserAccountsComponent } from './user-accounts/user-accounts.component';
import { LogsPageComponent } from './logs-page/logs-page.component';
import { ForgotPasswordComponent } from './login/forgot-password/forgot-password.component';

const appRoutes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'userAccounts', component: UserAccountsComponent },
    { path: 'createUser', component: CreateUserComponent },
    { path: 'logsPage', component: LogsPageComponent },
    { path: 'forgotpassword', component: ForgotPasswordComponent },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const AppRoutingModule = RouterModule.forRoot(appRoutes);
