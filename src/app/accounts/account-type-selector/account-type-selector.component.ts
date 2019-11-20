import { Component, Input, OnInit } from '@angular/core';
import { LogTrack, User } from '../../_models';
import { first } from 'rxjs/operators';
import { ChartOfAccounts } from '../../_models/chartOfAccounts';
import { ChartOfAccountsService } from '../../_services/chart-of-accounts.service';

@Component({
  selector: 'app-account-type-selector',
  templateUrl: './account-type-selector.component.html',
  styleUrls: ['./account-type-selector.component.css']
})
export class AccountTypeSelectorComponent implements OnInit {

  currentUser: User;

  @Input()
  account: ChartOfAccounts;

  constructor(private chartofAccountsService: ChartOfAccountsService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  onOptionSelect(selected: string, account: ChartOfAccounts) {
    if (this.currentUser.role === '1') {

      const newLog = new LogTrack();
      newLog.logDataInput = 'Changed the account Type of account ' +
          account.accountName + ' to ' + selected + ' from ' + account.accountType;
      newLog.logInitial =  account.accountName + ' type: ' + account.accountType;
      newLog.logFinal =  account.accountName + ' type: ' + selected;

      account.accountType = selected;
      this.chartofAccountsService.updateAccount(account, newLog).pipe(first()).subscribe(() => {
      });
    }
  }

  ngOnInit() {
  }
}
