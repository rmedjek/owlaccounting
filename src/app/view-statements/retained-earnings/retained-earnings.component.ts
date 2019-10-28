import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {first} from 'rxjs/operators';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { Ledger } from '../../_models/ledger';
import { ChartOfAccounts } from '../../_models/chartOfAccounts';
import { ChartOfAccountsService } from '../../_services/chart-of-accounts.service';
import { LedgerService } from '../../_services/ledger.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-retained-earnings',
  templateUrl: './retained-earnings.component.html',
  styleUrls: ['./retained-earnings.component.css']
})
export class RetainedEarningsComponent implements OnInit {
  accountList: ChartOfAccounts[] = [];
  allAccounts: ChartOfAccounts[] = [];
  allEntries: Ledger[] = [];
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
    this.date = new Date((document.getElementById('date') as HTMLInputElement).value);
  }

  public captureScreen() {
    const data = document.getElementById('retained-earnings-table');
    html2canvas(data).then(canvas => {
      const imgWidth = 450;
      const imgHeight = canvas.height * imgWidth / canvas.width;

      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jspdf('p', 'pt', 'letter');
      const position = 100;
      pdf.text(130, 90, 'Statement Of Retained Earnings ' + 'as of ' + this.date.toDateString());
      pdf.addImage(contentDataURL, 'PNG', 120, position, imgWidth, imgHeight);
      pdf.save('Retained-Earnings-Statement.pdf'); // Generated PDF
    });
  }
}
