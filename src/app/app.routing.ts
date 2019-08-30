import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login';

const appRoutes: Routes = [
    { path: 'login', component: LoginComponent },

  // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);
