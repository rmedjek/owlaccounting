import { Injectable } from '@angular/core';
import {
    Resolve,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    Router
} from '@angular/router';
import { ChartOfAccounts } from '../_models/chartOfAccounts';
import { ChartOfAccountsService } from './chart-of-accounts.service';
import { take, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class EditAccountResolverService implements Resolve<ChartOfAccounts> {
    constructor(private chartOfAccountsService: ChartOfAccountsService, private router: Router) {}
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<ChartOfAccounts> {
        const id = route.paramMap.get('id');
        return this.chartOfAccountsService.getAccountById(id).pipe(
            take(1),
            map(account => {
                if (account) {
                    return account;
                } else {
                    this.router.navigate(['accounts']);
                    return null;
                }
            })
        );
    }
}
