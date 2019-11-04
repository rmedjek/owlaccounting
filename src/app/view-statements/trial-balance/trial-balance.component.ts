import { AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { Ledger } from '../../_models/ledger';
import { ChartOfAccounts } from '../../_models/chartOfAccounts';
import { ChartOfAccountsService } from '../../_services/chart-of-accounts.service';
import { LedgerService } from '../../_services/ledger.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';


@Component({
  selector: 'app-trial-balance',
  templateUrl: './trial-balance.component.html',
  styleUrls: ['./trial-balance.component.css']
})
export class TrialBalanceComponent implements OnInit {
  accountList: ChartOfAccounts[] = [];
  allAccounts: ChartOfAccounts[] = [];
  allEntries: Ledger[] = [];
  entriesList: Ledger[] = [];
  date: Date;

  constructor( private accountsService: ChartOfAccountsService,
               private router: Router,
               private ledgerService: LedgerService,
               private spinnerService: Ng4LoadingSpinnerService) {}

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
    this.ledgerService.getAll().pipe(first()).subscribe(entry => {
      this.allEntries = entry;
      this.entriesList = entry;
      this.spinnerService.hide();
    });
  }

  totalDebits() {
    let totalDebit = 0;
    this.accountList.forEach((account) => {
      if ((account.accountType === 'Asset' || account.accountType === 'Expense') && account.accountActive === true) {
        totalDebit = totalDebit + account.accountBalance;
      }
    });
    return totalDebit;
}

  totalCredits() {
    let totalCredit = 0;
    this.accountList.forEach((account) => {
      if ((account.accountType !== 'Asset' && account.accountType !== 'Expense') && account.accountActive === true) {
        totalCredit = totalCredit + account.accountBalance;
      }
    });
    return totalCredit;
  }

  adjustAccount() {
    const closingEntries = this.allEntries.filter((entry) => entry.entryType === 'closing');
    this.allAccounts.forEach((account) => {
      closingEntries.forEach((entry) => {
        if (account.accountName === entry.accountName && (account.accountType === 'Expense' || account.accountType === 'Asset')) {
                account.accountBalance =  entry.amount;
              }
      });
    });
    return this.allAccounts;
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

  sortLiability() {
    const result = [];
    this.accountList.forEach( (account) => {
      if (account.accountType === 'Liability') {
        result.push(account);
      }
    });
    return result[0].accountName;
  }

  setLedgerSortEntry(ledgerSortAccount: string, accountNumber: number) {
    localStorage.setItem('accountSortBy', JSON.stringify(ledgerSortAccount));
    localStorage.setItem('accountNumber', JSON.stringify(accountNumber));
    this.router.navigate(['/ledger']);
  }

  getSpecificAccountBalance(account: string) {
    const search = this.accountList.filter(entry => entry.accountName === account);
    if (search[0]) {
      return search[0].accountBalance;
    }
  }

  getRetainedEarnings() {
    const retainedAccount = this.allAccounts.filter((account) => account.accountName === 'Retained Earnings');
    if (retainedAccount[0]) {
      return retainedAccount[0].accountBalance;
    }
  }

  public captureScreen() {
    const data = document.getElementById('trial-balance-table');
    html2canvas(data).then(canvas => {
      const imgWidth = 450;
      const imgHeight = canvas.height * imgWidth / canvas.width;

      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jspdf('p', 'pt', 'letter');
      const position = 100;
      pdf.text(130, 90, 'Trial Balance Statement ' + 'as of ' + this.date.toDateString());
      pdf.addImage(contentDataURL, 'PNG', 120, position, imgWidth, imgHeight);
      pdf.save('Trial-Balance-Statement.pdf'); // Generated PDF
    });
  }
}
