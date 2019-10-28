import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { ChartOfAccounts } from '../../_models/chartOfAccounts';
import { Ledger } from '../../_models/ledger';
import { ChartOfAccountsService } from '../../_services/chart-of-accounts.service';
import { LedgerService } from '../../_services/ledger.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-income-statement',
  templateUrl: './income-statement.component.html',
  styleUrls: ['./income-statement.component.css']
})
export class IncomeStatementComponent implements OnInit {
  accountList: ChartOfAccounts[] = [];
  allAccounts: ChartOfAccounts[] = [];
  ledgers: Ledger[] = [];
  allEntries: Ledger[] = [];
  dateSelectorEnabled = false;
  date: Date;

  constructor(private accountsService: ChartOfAccountsService,
              private router: Router,
              private ledgerService: LedgerService,
              private spinnerService: Ng4LoadingSpinnerService) {
  }

  ngOnInit() {
    this.loadAllAccounts();
    this.loadAllEntries();
    this.date = new Date();
  }

  private loadAllAccounts() {
    this.spinnerService.show();
    return this.accountsService.getAll().pipe(first()).subscribe(account => {
      this.accountList = account;
      this.allAccounts = account;
      this.spinnerService.hide();
    });
  }

  private loadAllEntries() {
    this.spinnerService.show();
    return this.ledgerService.getAll().pipe(first()).subscribe(entry => {
      this.ledgers = entry;
      this.allEntries = entry;
      this.spinnerService.hide();
    });
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

  dateChange() {
  this.loadAllEntries();
  this.dateSelectorEnabled = true;
  this.date = new Date((document.getElementById('date') as HTMLInputElement).value);
  }

  expenseAdjustment() {
    let total = this.totalExpense();
    this.ledgers.forEach((entry) => {
      const entryDate = new Date(entry.createdDate);
      const updatesEntryDate = entryDate.getFullYear() + '-' + this.monthConverter(entryDate) + '-' + this.day_of_the_month(entryDate);
      const date = (document.getElementById('date') as HTMLInputElement).value;
      if ((updatesEntryDate > date) && this.findAccountType(entry.accountName) === 'Expense') {
      if (entry.accountDebit) {
         total -= entry.amount;
      } else {
        total += entry.amount;
      }
    }
    });
    return total;
  }

  revenueAdjustment() {
    let total = this.totalRevenue();
    this.ledgers.forEach((entry) => {
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

  setTTableSortEntry(tTableSortAccount: string, accountNumber: number) {
    localStorage.setItem('accountSortBy', JSON.stringify(tTableSortAccount));
    localStorage.setItem('accountNumber', JSON.stringify(accountNumber));
    this.router.navigate(['/ttable']);
  }

  public captureScreen() {
    const data = document.getElementById('income-statement-table');
    html2canvas(data).then(canvas => {
      // Few necessary setting options
      const imgWidth = 450;
      const imgHeight = canvas.height * imgWidth / canvas.width;

      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jspdf('p', 'pt', 'letter');
      const position = 100;
      pdf.text(130, 90, 'Income Statement ' + 'as of ' + this.date.toDateString());
      pdf.addImage(contentDataURL, 'PNG', 120, position, imgWidth, imgHeight);
      pdf.save('Income-Statement.pdf'); // Generated PDF
    });
  }
}
