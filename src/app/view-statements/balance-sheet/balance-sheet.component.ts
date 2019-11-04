import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {first} from 'rxjs/operators';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { ChartOfAccounts } from '../../_models/chartOfAccounts';
import { Ledger } from '../../_models/ledger';
import { ChartOfAccountsService } from '../../_services/chart-of-accounts.service';
import { LedgerService } from '../../_services/ledger.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-balance-sheet',
  templateUrl: './balance-sheet.component.html',
  styleUrls: ['./balance-sheet.component.css']
})
export class BalanceSheetComponent implements OnInit {
  accountList: ChartOfAccounts[] = [];
  allAccounts: ChartOfAccounts[] = [];
  entries: Ledger[] = [];
  dateSelectorEnabled = false;
  date: Date;

  constructor( private accountsService: ChartOfAccountsService,
               private router: Router,
               private ledgerService: LedgerService,
               private spinnerService: Ng4LoadingSpinnerService) { }

  ngOnInit() {
    this.loadAllAccounts();
    this.loadAllEntries();
    this.date = new Date();
  }

  private loadAllAccounts() {
    this.spinnerService.show();
    return this.accountsService.getAll()
        .pipe(first()).subscribe(account => {
      this.accountList = account;
      this.allAccounts = account;
      this.spinnerService.hide();
        });
  }

  private loadAllEntries() {
    this.spinnerService.show();
    return this.ledgerService.getAll()
        .pipe(first()).subscribe(entry => {
          this.entries = entry;
          this.spinnerService.hide();
        });
  }

  totalAssets() {
    let total = 0;
    this.accountList.forEach((account) => {
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

  sortAssets() {
    const result = [];
    this.accountList.forEach( (account) => {
      if (account.accountType === 'Asset') {
        result.push(account);
      }
    });
    return result[0].accountName;
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


  totalCurrentLiability() {
    let total = 0;
    const accounts = this.accountList.filter(account => account.accountTerm === 'Current Liability');
    accounts.forEach((account) => {
      if (account.accountType === 'Liability' && account.accountActive === true) {
        total = total + account.accountBalance;
      }
    });
    return total;
  }

  totalOtherLiability() {
    let total = 0;
    const accounts = this.accountList.filter(account => account.accountTerm !== 'Current Liability');
    accounts.forEach((account) => {
      if (account.accountType === 'Liability' && account.accountActive === true) {
        total = total + account.accountBalance;
      }
    });
    return total;
  }

  assetAdjustment() {
    let total = this.totalAssets();
    this.entries.forEach((entry) => {
      const entryDate = new Date(entry.createdDate);
      const updatesEntryDate = entryDate.getFullYear() + '-' + this.monthConverter(entryDate) + '-' + this.day_of_the_month(entryDate);
      const date = (document.getElementById('date') as HTMLInputElement).value;
      if ((updatesEntryDate > date) && this.findAccountType(entry.accountName) === 'Asset') {
        if (entry.accountDebit) {
          total -= entry.amount;
        } else {
          total += entry.amount;
        }
      }
    });
    return total;
  }


  day_of_the_month(d) {
    return (d.getDate() < 10 ? '0' : '') + d.getDate();
  }

  monthConverter(d) {
    return (d.getMonth() < 10 ? '0' : '') + d.getMonth();
  }

  findAccountType(accountName: string) {
    const account = this.allAccounts.filter(entry => entry.accountName === accountName);
    return account[0].accountType;
  }

  totalLiability() {
    let total = 0;
    this.accountList.forEach((account) => {
      if (account.accountType === 'Liability' && account.accountActive === true) {
        total = total + account.accountBalance;
      }
    });
    return total;
  }

  liabilityAdjustment() {
    let total = this.totalLiability();
    this.entries.forEach((entry) => {
      const entryDate = new Date(entry.createdDate);
      const updatesEntryDate = entryDate.getFullYear() + '-' + this.monthConverter(entryDate) + '-' + this.day_of_the_month(entryDate);
      const date = (document.getElementById('date') as HTMLInputElement).value;
      if ((updatesEntryDate > date) && this.findAccountType(entry.accountName) === 'Liability') {
        if (entry.accountDebit) {
          total += entry.amount;
        } else {
          total -= entry.amount;
        }
      }
    });
    return total;
  }

  dateChange() {
    this.loadAllEntries();
    this.dateSelectorEnabled = true;
    this.date = new Date((document.getElementById('date') as HTMLInputElement).value);
  }

  totalEquity() {
    let total = 0;
    this.accountList.forEach((account) => {
      if (account.accountType === 'Equity' && account.accountActive === true) {
        total = total + account.accountBalance;
      }
    });
    return total;
  }

  equityAdjustment() {
    let total = this.totalEquity();
    this.entries.forEach((entry) => {
      const entryDate = new Date(entry.createdDate);
      const updatesEntryDate = entryDate.getFullYear() + '-' + this.monthConverter(entryDate) + '-' + this.day_of_the_month(entryDate);
      const date = (document.getElementById('date') as HTMLInputElement).value;
      if ((updatesEntryDate > date) && this.findAccountType(entry.accountName) === 'Equity') {
        if (entry.accountDebit) {
          total += entry.amount;
        } else {
          total -= entry.amount;
        }
      }
    });
    return total;
  }



  revenueAdjustment() {
    let total = this.totalRevenue();
    this.entries.forEach((entry) => {
      const entryDate = new Date(entry.createdDate);
      const updatesEntryDate = entryDate.getFullYear() + '-' + this.monthConverter(entryDate) + '-' + this.day_of_the_month(entryDate);
      const date = (document.getElementById('date') as HTMLInputElement).value;
      if ((updatesEntryDate > date) && this.findAccountType(entry.accountName) === 'Revenue') {
        if (entry.accountDebit) {
          total += entry.amount;
        } else {
          total -= entry.amount;
        }
      }
    });
    return total;
  }
  totalRevenue() {
    let total = 0;
    this.allAccounts.forEach((account) => {
      if (account.accountType === 'Revenue' && account.accountActive === true) {
        total = total + account.accountBalance;
      }
    });
    return total;
  }

  totalExpense() {
    let total = 0;
    this.allAccounts.forEach((account) => {
      if (account.accountType === 'Expense' && account.accountActive === true) {
        total = total + account.accountBalance;
      }
    });
    return total;
  }

  adjustAccount() {
    const closingEntries = this.entries.filter((entry) => entry.entryType === 'closing');

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

  incomeEstimation() {
    return this.totalRevenue() - this.totalExpense();
  }

  setLedgerSortEntry(tTableSortAccount: string, accountNumber: number) {
    localStorage.setItem('accountSortBy', JSON.stringify(tTableSortAccount));
    localStorage.setItem('accountNumber', JSON.stringify(accountNumber));
    this.router.navigate(['/ttable']);
  }


  public captureScreen() {
    const data = document.getElementById('balance-sheet-table');
    html2canvas(data).then(canvas => {
      // Few necessary setting options
      const imgWidth = 450;
      const imgHeight = canvas.height * imgWidth / canvas.width;

      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jspdf('p', 'pt', 'letter'); // A4 size page of PDF
      const position = 50;
      pdf.addImage(contentDataURL, 'PNG', 50, position, imgWidth, imgHeight);
      pdf.save('Balance-Sheet.pdf'); // Generated PDF
    });
  }


}
