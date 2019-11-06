import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '../_models';
import { SystemAlertsForUsers } from '../_models/SystemAlertsForUsers';
import { ChartOfAccounts } from '../_models/chartOfAccounts';
import { Ledger } from '../_models/ledger';
import { SystemAlertsForUsersService } from '../_services/system-alerts-for-users.service';
import { LedgerService } from '../_services/ledger.service';
import { ChartOfAccountsService } from '../_services/chart-of-accounts.service';
import { JournalEntryService } from '../_services/journal-entry.service';
import { JournalEntry } from '../_models/journal-entries';


@Component({styleUrls: ['home.component.css'],
  templateUrl: 'home.component.html'})
export class HomeComponent implements OnInit {
  currentUser: User;
  alerts: SystemAlertsForUsers[] = [];
  accountSpecificEntries: SystemAlertsForUsers[] = [];
  accountList: ChartOfAccounts[] = [];
  allAccounts: ChartOfAccounts[] = [];
  allJournalEntries: JournalEntry[] = [];
  allEntries: Ledger[] = [];
  entriesList: Ledger[] = [];
  chartData: number[] = [];
  showBarGraph = false;

  constructor(private alertsForUsersService: SystemAlertsForUsersService,
              private ledgerService: LedgerService,
              private accountsService: ChartOfAccountsService,
              private journalService: JournalEntryService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.getAllAlerts();
    this.loadAllAccounts();
    this.loadAllEntries();
    this.loadAllJournalEntries();
    setTimeout(() => {
      this.setGraphData();
    }, 1800);
    setTimeout(() => {
      this.showBarGraph = true;
    }, 2000);
    setTimeout(() => {
      this.setBarGraph();
    }, 2000);
  }

  private loadAllAccounts() {
    this.accountsService.getAll().pipe(first()).subscribe(account => {
      this.accountList = account;
      this.allAccounts = account;
    });
  }

  private loadAllEntries() {
    this.ledgerService.getAll().pipe(first()).subscribe(entry => {
      this.allEntries = entry;
      this.entriesList = entry;
    });
  }

  private loadAllJournalEntries() {
    this.journalService.getAll().pipe(first()).subscribe(entry => {
      this.allJournalEntries = entry;
    });
  }

  setGraphData() {
    this.chartData.push(this.currentRatio());
    this.chartData.push(this.returnOnAssetsRatio());
    this.chartData.push(this.returnOnEquityRatio());
    this.chartData.push(this.assetTurnoverRatio());
    this.chartData.push(this.quickRatio());
    this.chartData.push(this.netProfitMargin());
    const final = this.chartData.sort( (x, y) => {
      if (x < y) {
        return -1;
      }
      if (x > y) {
        return 1;
      }
      return 0;
    });

    this.chartData = final.reverse();
  }

  setBarGraph() {
    ((document.getElementById('currentRatio') as HTMLInputElement).style.height) = this.currentRatio().toString();
    ((document.getElementById('retunOnAssets') as HTMLInputElement).style.height) = this.returnOnAssetsRatio().toString();
    ((document.getElementById('returnOnEquity') as HTMLInputElement).style.height) = this.returnOnEquityRatio().toString();
    ((document.getElementById('assetTurnover') as HTMLInputElement).style.height) = this.assetTurnoverRatio().toString();
    ((document.getElementById('quickRatio') as HTMLInputElement).style.height) = this.quickRatio().toString();
    ((document.getElementById('netProfitMargin') as HTMLInputElement).style.height) = this.netProfitMargin().toString();
  }
  getAllAlerts() {
    this.alertsForUsersService.getAll().pipe(first()).subscribe(data => {
      this.alerts = data;
    });
  }

  toggleCheckbox(alert: SystemAlertsForUsers) {
    alert.performed = true;
    this.alertsForUsersService.updateEntry(alert).pipe(first()).subscribe(() => {
      this.getAllAlerts();
    });
  }

  filterItemList(entries: Ledger[]) {
    this.accountSpecificEntries  = this.alerts.filter(entry => entry.performed === false);

    return this.accountSpecificEntries;
  }

  filterAccountTypeTotal(accountType: string) {
    let total = 0;
    const account = this.allAccounts.filter(entry => entry.accountType === accountType);
    account.forEach((account) => {
      total = total + account.accountBalance;
    });
    return total;
  }

  filterByNumberOfAccounts(accountType: string) {
    let total = 0;
    const account = this.adjustAccount().filter(entry => entry.accountType === accountType);
    total = account.length;
    return total;
  }

  currentRatio() {
    let quotient = 0;
    let remainder = 0;
    quotient = Math.floor(this.filterAccountTypeTotal('Asset') / this.filterAccountTypeTotal('Liability'));
    remainder = (this.filterAccountTypeTotal('Asset') / this.filterAccountTypeTotal('Liability')) % 1 ;
    return quotient + remainder;
  }

  totalRevenue() {
    let total = 0;
    this.adjustAccount().forEach((account) => {
      if (account.accountType === 'Revenue' && account.accountActive === true) {
        total = total + account.accountBalance;
      }
    });
    return total;
  }

  totalExpense() {
    let total = 0;
    this.adjustAccount().forEach((account) => {
      if (account.accountType === 'Expense' && account.accountActive === true) {
        total = total + account.accountBalance;
      }
    });
    return total;
  }

  returnOnAssetsRatio() {
    let assetQuotient = 0;
    let assetRemainder = 0;
    let quotient = 0;
    let remainder = 0;
    assetQuotient = Math.floor(this.filterAccountTypeTotal('Asset') / this.filterByNumberOfAccounts('Asset'));
    assetRemainder = (this.filterAccountTypeTotal('Asset') / this.filterByNumberOfAccounts('Asset')) % 1 ;
    const totalIncome = this.totalRevenue() - this.totalExpense();
    const averageAssets = assetQuotient + assetRemainder;
    quotient = Math.floor(totalIncome / averageAssets);
    remainder =  ((totalIncome / averageAssets) % 1 );
    return quotient + remainder;
  }

  returnOnEquityRatio() {
    let equityQuotient = 0;
    let equityRemainder = 0;
    let quotient = 0;
    let remainder = 0;
    equityQuotient = Math.floor(this.filterAccountTypeTotal('Equity') / this.filterByNumberOfAccounts('Equity'));
    equityRemainder = (this.filterAccountTypeTotal('Equity') / this.filterByNumberOfAccounts('Equity')) % 1 ;
    const totalIncome = this.totalRevenue() - this.totalExpense();
    const averageAssets = equityQuotient + equityRemainder;
    quotient = Math.floor(totalIncome / averageAssets);
    remainder =  ((totalIncome / averageAssets) % 1 );
    return quotient + remainder;
  }

  assetTurnoverRatio() {
    let assetQuotient = 0;
    let assetRemainder = 0;
    let quotient = 0;
    let remainder = 0;
    assetQuotient = Math.floor(this.filterAccountTypeTotal('Asset') / this.filterByNumberOfAccounts('Asset'));
    assetRemainder = (this.filterAccountTypeTotal('Asset') / this.filterByNumberOfAccounts('Asset')) % 1 ;
    const NetRevenue = this.totalRevenue();
    const averageAssets = assetQuotient + assetRemainder;
    quotient = Math.floor(NetRevenue / averageAssets);
    remainder =  ((NetRevenue / averageAssets) % 1 );
    return quotient + remainder;
  }

  netProfitMargin() {
    const income = this.totalRevenue() - this.totalExpense();
    const quotient = Math.floor(income / this.totalRevenue());
    const remainder =  ((income / this.totalRevenue()) % 1 );
    return quotient + remainder;
  }

  returnSubtype(compared: string) {
    let total = 0;
    const account = this.adjustAccount().filter(entry => entry.accountSubType === compared);
    account.forEach((account1) => {
      total = total + account1.accountBalance;
    });
    return total;
  }

  returnTerm(compared: string) {
    let total = 0;
    const account = this.adjustAccount().filter(entry => entry.accountTerm === compared);
    account.forEach((account1) => {
      total = total + account1.accountBalance;
    });
    return total;
  }

  quickRatio() {
    const numerator = ((this.totalCurrentAssets() + this.totalOtherAssets()) - this.returnSubtype('Inventories'));
    const liability = this.filterAccountTypeTotal('Liability');
    const quotient = Math.floor(numerator / liability);

    const remainder =  ((numerator / liability) % 1 );
    return quotient + remainder;
  }

  totalOtherAssets() {
    let total = 0;
    const accounts = this.accountList.filter(account => account.accountTerm !== 'Current Asset');
    accounts.forEach((account) => {
      if (account.accountType === 'Asset' && account.accountActive === true) {
        total = total + account.accountBalance;
      }
    });
    return total;
  }

  totalCurrentAssets() {
    let total = 0;
    const accounts = this.accountList.filter(account => account.accountTerm === 'Current Asset');
    accounts.forEach((account) => {
      if (account.accountType === 'Asset' && account.accountActive === true) {
        total = total + account.accountBalance;
      }
    });
    return total;
  }

  adjustAccount() {
    const closingEntries = this.allEntries.filter((entry) => entry.entryType === 'closing');

    this.allAccounts.forEach((account) => {
      closingEntries.forEach((entry) => {
        if (account.accountName === entry.accountName) {
          if ((account.accountType === 'Expense' || account.accountType === 'Asset') && entry.entryType === 'closing') {
            account.accountBalance =  entry.amount;
          } else {
            account.accountBalance =  entry.amount;
          }
        }
      });
    });
    return this.allAccounts;
  }
}
