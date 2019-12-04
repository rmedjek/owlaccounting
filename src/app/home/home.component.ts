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
import { ChartOptions, ChartType } from 'chart.js';
import { Colors, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip, SingleDataSet } from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';

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
  chart: number[] = [];
  showBarGraph = false;
  pendingTransactions = 0;
  approvedTransactions = 0;
  deniedTransactions = 0;
  allTransactions = 0;

  public pieChartOptions: ChartOptions = {
    responsive: true,

    maintainAspectRatio: false,
    legend: {
      display: true,
      labels: {
        fontSize: 16,
        usePointStyle: true
      },
      position: 'top',
    },
    plugins: {
      datalabels: {
        color: '#5d5d5d',
        font: {
          size: 18,
        }
      },
    }
  };

  public pieChartLabels: Label[] = [['Pending'], ['Approved'], 'Denied', ['Total Entries']];
  public pieChartData: SingleDataSet = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [pluginDataLabels];
  public pieChartColors: Colors[] = [{backgroundColor: ['#e2da3c', '#20d52f', '#d52020']}];

  constructor(private alertsForUsersService: SystemAlertsForUsersService,
              private ledgerService: LedgerService,
              private accountsService: ChartOfAccountsService,
              private journalService: JournalEntryService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
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
    this.journalService.getAll().pipe(first()).subscribe(journalEntry => {
      this.allJournalEntries = journalEntry;
      this.allJournalEntries.forEach((entry) => {
        if (entry.status === 'pending') {
          this.pendingTransactions++;
        } else if (entry.status === 'approved') {
          this.approvedTransactions++;
        } else if (entry.status === 'declined') {
          this.deniedTransactions++;
        } else {
          return this.allTransactions++;
        }
      });
      this.pieChartData = [this.pendingTransactions, this.approvedTransactions, this.deniedTransactions, this.returnAllEntries()];
    });
  }

  countPendingEntries() {
    const pendingAccounts = this.allJournalEntries.filter(entry => entry.status === 'pending');
    return pendingAccounts.length;
  }

  countApproveEntries() {
    const pendingAccounts = this.allJournalEntries.filter(entry => entry.status === 'approved');
    return pendingAccounts.length;
  }

  countDeclinedEntries() {
    const pendingAccounts = this.allJournalEntries.filter(entry => entry.status === 'declined');
    return pendingAccounts.length;
  }

  returnAllEntries() {
    return this.allJournalEntries.length;
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

  setGraphData() {
    this.chart.push(this.currentRatio());
    this.chart.push(this.returnOnAssetsRatio());
    this.chart.push(this.returnOnEquityRatio());
    this.chart.push(this.assetTurnoverRatio());
    this.chart.push(this.quickRatio());
    this.chart.push(this.netProfitMargin());
    const final = this.chart.sort( (x, y) => {
      if (x < y) {
        return -1;
      }
      if (x > y) {
        return 1;
      }
      return 0;
    });

    this.chart = final.reverse();
  }

  returnOnAssetsRatio() {
    return ((this.totalRevenue() - this.totalExpense()) / this.filterAccountTypeTotal('Asset'));
  }

  returnOnEquityRatio() {
    return ((this.totalRevenue() - this.totalExpense()) / this.filterAccountTypeTotal('Equity'));
  }

  assetTurnoverRatio() {
    return (this.totalRevenue() / this.filterAccountTypeTotal('Asset'));
  }

  netProfitMargin() {
    return ((this.totalRevenue() - this.totalExpense()) / this.totalRevenue());
  }

  quickRatio() {
    return ((this.returnSubtype('Current Asset') - this.returnSubtype('Inventories')) /
        this.returnSubtype('Current Liability'));
  }

  currentRatio() {
    return this.returnSubtype('Current Asset') / this.returnSubtype('Current Liability');
  }


  filterAccountTypeTotal(accountType: string) {
    let total = 0;
    const account = this.allAccounts.filter(entry => entry.accountType === accountType);
    account.forEach((account) => {
      total = total + account.accountBalance;
    });
    return total;
  }

  filterByName(accountName: string) {
    let total = 0;
    const account = this.allAccounts.filter(entry => entry.accountName === accountName);
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

  totalExpense() {
    let total = 0;
    this.adjustAccount().forEach((account) => {
      if (account.accountType === 'Expense' && account.accountActive === true) {
        total = total + account.accountBalance;
      }
    });
    return total;
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

  returnSubtype(compared: string) {
    let total = 0;
    const account = this.adjustAccount().filter(entry => entry.accountSubType === compared);
    account.forEach((account1) => {
      total = total + account1.accountBalance;
    });
    return total;
  }
  totalOtherAssets() {
    let total = 0;
    const accounts = this.accountList.filter(account => account.accountSubType !== 'Current Asset');
    accounts.forEach((account) => {
      if (account.accountType === 'Asset' && account.accountActive === true) {
        total = total + account.accountBalance;
      }
    });
    return total;
  }

  totalCurrentAssets() {
    let total = 0;
    const accounts = this.accountList.filter(account => account.accountSubType === 'Current Asset');
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
            account.accountBalance = entry.amount;
          } else {
            account.accountBalance = entry.amount;
          }
        }
      });
    });
    return this.allAccounts;
  }
}
