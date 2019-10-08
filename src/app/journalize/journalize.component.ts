import { Component, OnInit } from '@angular/core';
import { User } from '../_models';
import { ChartOfAccounts } from '../_models/chartOfAccounts';
import { ChartOfAccountsService } from '../_services/chart-of-accounts.service';
import { JournalEntryService } from '../_services/journal-entry.service';
import { Router } from '@angular/router';
import { AlertService } from '../_services';
import { SystemAlertsForUsersService } from '../_services/system-alerts-for-users.service';
import { first } from 'rxjs/operators';
import { JournalEntry } from '../_models/journal-entries';

@Component({
  selector: 'app-journalize',
  templateUrl: './journalize.component.html',
  styleUrls: ['./journalize.component.css']
})
export class JournalizeComponent implements OnInit {
  currentUser: User;
  accountList: ChartOfAccounts[] = [];
  allAccounts: ChartOfAccounts[] = [];
  allEntries: JournalEntry[] = [];
  entriesList: JournalEntry[] = [];
  allEntriesBackup: JournalEntry[] = [];
  entriesListBackup: JournalEntry[] = [];
  listOfDebitAccountNames: string[] = [];
  listOfCreditAccountNames: string[] = [];
  listOfDebitAccountAmounts = [];
  listOfCreditAccountAmounts = [];
  debitAccountsLists = [];
  creditAccountsLists = [];
  debitContainsNegativeValue = false;
  creditContainsNegativeValue = false;
  errorExistsInNewJournal = false;
  emptyInput = false;
  Date = Date.now();
  isDebitCreditAccountNameSame = false;
  totalDebit = 0;
  totalCredit = 0;
  negativeBalanceError = false;
  creditDebitAccountMatchError = false;
  submitButtonClicked = false;
  emptyDate = false;
  creditDebitUnbalanceError = false;
  newJournalEntryHidden = true;
  approvedOrDeclinedEntries = false;
  updateAccountForm = false;

  constructor(private accountsService: ChartOfAccountsService,
              private journalEntryService: JournalEntryService,
              private router: Router,
              private alertService: AlertService,
              private systemAlertsForUsersService: SystemAlertsForUsersService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.loadAllAccounts();
    this.loadAllJournalEntries();
    setInterval(() => {
      this.Date = Date.now();
    }, 1000);
  }

  onSubmit() {
    this.debitAccountNames();
    this.debitAccountAmounts();
    this.creditAccountNames();
    this.creditAccountAmounts();
    this.negativeDebitAccountAmounts();
    this.negativeCreditAccountAmounts();
    this.zeroDebitAccountAmount();
    this.zeroCreditAccountAmount();
    this.emptyDebitAccountAmounts();
    this.emptyCreditAccountAmounts();
    this.creditDebitAccSameName();
    this.creditAccSameNameWithIndex();
    this.addDebitAmount();
    this.addCreditAmount();
    this.debitCreditNegativeValuesErrorHandler();
    this.debitCreditAccountNameSameErrorHandler();
    this.createEntry();
  }

  private loadAllAccounts() {
    this.accountsService.getAll().pipe(first()).subscribe(account => {
      this.accountList = account;
      this.allAccounts = account;
    });
  }

  private loadAllJournalEntries() {
    this.journalEntryService.getAll().pipe(first()).subscribe(entry => {
      this.allEntries = entry;
      this.entriesList = entry;
    });
  }

  getAccountById(accountId: string) {
    return this.allAccounts.find(x => x._id === accountId);
  }


  private debitAccountNames() {
    this.listOfDebitAccountNames.push(this.getAccountById((
        document.getElementById('debitAccountName') as HTMLInputElement).value).accountName);
    this.debitAccountsLists.forEach((item, index) => {
      this.listOfDebitAccountNames.push(this.getAccountById((
          document.getElementById('debitAccountName' + index) as HTMLInputElement).value).accountName);
    });
  }

  private debitAccountAmounts() {
    this.listOfDebitAccountAmounts.push((document.getElementById('debitInput') as HTMLInputElement).value);
    this.debitAccountsLists.forEach((item, index) => {
      this.listOfDebitAccountAmounts.push(((document.getElementById('debitInput' + index) as HTMLInputElement).value));
    });
  }

  private creditAccountNames() {
    this.listOfCreditAccountNames.push(this.getAccountById((
        document.getElementById('creditAccountName') as HTMLInputElement).value).accountName);
    this.creditAccountsLists.forEach((item, index) => {
      this.listOfCreditAccountNames.push(this.getAccountById((
          document.getElementById('creditAccountName' + index) as HTMLInputElement).value).accountName);
    });
  }

  private creditAccountAmounts() {
    this.listOfCreditAccountAmounts.push((document.getElementById('creditInput') as HTMLInputElement).value);
    this.creditAccountsLists.forEach((item, index) => {
      this.listOfCreditAccountAmounts.push(((document.getElementById('creditInput' + index) as HTMLInputElement).value));
    });
  }

  private negativeDebitAccountAmounts() {
    this.listOfDebitAccountAmounts.forEach((item) => {
      if (item.includes('-')) {
        this.debitContainsNegativeValue = true;
        this.errorExistsInNewJournal = true;
        return;
      }
    });
  }

  private negativeCreditAccountAmounts() {
    this.listOfCreditAccountAmounts.forEach((item) => {
      if (item.includes('-')) {
        this.creditContainsNegativeValue = true;
        this.errorExistsInNewJournal = true;
        return;
      }
    });
  }

  private zeroDebitAccountAmount() {
    this.listOfDebitAccountAmounts.forEach((item) => {
      if (item === '0') {
        this.emptyInput = true;
        this.errorExistsInNewJournal = true;
        setTimeout(() => {
          this.emptyInput = false;
        }, 6000);
        return;
      }
    });
  }

  private zeroCreditAccountAmount() {
    this.listOfCreditAccountAmounts.forEach((item) => {
      if (item === '0') {
        this.emptyInput = true;
        this.errorExistsInNewJournal = true;
        setTimeout(() => {
          this.emptyInput = false;
        }, 6000);
        return;
      }
    });
  }

  private emptyDebitAccountAmounts() {
    this.listOfDebitAccountAmounts.forEach((item) => {
      if (item === '') {
        this.emptyInput = true;
        this.errorExistsInNewJournal = true;
        setTimeout(() => {
          this.emptyInput = false;
        }, 6000);
        return;
      }
    });
  }

  private emptyCreditAccountAmounts() {
    this.listOfCreditAccountAmounts.forEach((item) => {
      if (item === '') {
        this.emptyInput = true;
        this.errorExistsInNewJournal = true;
        setTimeout(() => {
          this.emptyInput = false;
        }, 6000);
        return;
      }
    });
  }

  private creditDebitAccSameName() {
    this.listOfCreditAccountNames.forEach((accountCredit) => {
      this.listOfDebitAccountNames.forEach((accountDebit) => {
        if (accountDebit === accountCredit) {
          this.errorExistsInNewJournal = true;
          this.isDebitCreditAccountNameSame = true;
          return;
        }
      });
    });
  }

  private creditAccSameNameWithIndex() {
    this.listOfCreditAccountNames.forEach((accountCredit, creditIndex) => {
      this.listOfDebitAccountNames.forEach((accountDebit, index) => {
        if (accountDebit === accountCredit && creditIndex !== index) {
          this.errorExistsInNewJournal = true;
          this.isDebitCreditAccountNameSame = true;
          return;
        }
      });
    });
  }

  private addDebitAmount() {
    this.listOfDebitAccountAmounts.forEach((amount) => {
      this.totalDebit += Number(amount);
    });
  }

  private addCreditAmount() {
    this.listOfCreditAccountAmounts.forEach((amount) => {
      this.totalCredit += Number(amount);
    });
  }

  private debitCreditNegativeValuesErrorHandler() {
    if (this.debitContainsNegativeValue || this.creditContainsNegativeValue) {
      this.negativeBalanceError = true;
      setTimeout(() => {
        this.negativeBalanceError = false;
      }, 6000);
      this.debitContainsNegativeValue = false;
      this.creditContainsNegativeValue = false;
      return;
    }
  }

  private debitCreditAccountNameSameErrorHandler() {
    if (this.isDebitCreditAccountNameSame) {
      this.creditDebitAccountMatchError = true;
      setTimeout(() => {
        this.creditDebitAccountMatchError = false;
      }, 6000);
      this.isDebitCreditAccountNameSame = false;
      this.submitButtonClicked = false;
      return;
    }
  }

  addDebitRow() {
    this.debitAccountsLists.push({value: ''});
  }

  addCreditRow() {
    this.creditAccountsLists.push({value: ''});
  }

  private errorCheck() {
    return this.emptyDate || this.creditDebitUnbalanceError || this.creditDebitAccountMatchError || this.negativeBalanceError ||
        this.debitContainsNegativeValue || this.creditContainsNegativeValue || this.isDebitCreditAccountNameSame || this.emptyInput ||
        this.errorExistsInNewJournal;
  }

  private createEntry() {
    if (this.errorCheck()) {
      if ((this.totalDebit === this.totalCredit)) {
        this.totalCredit = 0;
        this.totalDebit = 0;
        this.newJournalEntryHidden = true;
        const newJournal = new JournalEntry();
        newJournal.type = ((document.getElementById('typeSelector') as HTMLInputElement).value);
        newJournal.createdBy = this.currentUser.username;
        newJournal.accountDebit = this.listOfDebitAccountNames;
        newJournal.accountCredit = this.listOfCreditAccountNames;
        newJournal.amountCredit = this.listOfCreditAccountAmounts;
        newJournal.amountDebit = this.listOfDebitAccountAmounts;
        // newJournal.createdDate = (dateInputted);
        newJournal.createdDate = new Date();
        newJournal.description = (document.getElementById('journalDescription') as HTMLInputElement).value;

        this.journalEntryService.createEntry(newJournal).pipe(first())
            .subscribe(
                data => {
                  this.debitAccountsLists = [];
                  this.creditAccountsLists = [];
                  this.loadAllJournalEntries();
                  this.debitAccountsLists.forEach((item, index) => {
                    if (index !== 0) {
                      item.pop();
                    }
                  });
                  this.submitButtonClicked = false;
                  this.alertService.success('Journal Created', true);
                  setTimeout(() => {
                    this.alertService.success('Journal Created', false);
                  }, 6000);
                  this.router.navigate(['/journalize']);
                }, error => {
                  this.submitButtonClicked = false;
                  this.alertService.error(error);
                });
      } else {
        this.submitButtonClicked = false;
        this.creditDebitUnbalanceError = true;
        setTimeout(() => {
          this.creditDebitUnbalanceError = false;
        }, 6000);
      }
    } else {
      this.submitButtonClicked = false;
    }
  }

  onOptionSelect(selected: string) {
    if (selected === 'pending') {
      this.approvedOrDeclinedEntries = false;
    }
    if (selected !== 'pending') {
      this.approvedOrDeclinedEntries = true;
    }
    this.entriesList = this.allEntries.filter(entry => entry.status.includes(selected));
    this.entriesListBackup = this.allEntries.filter(entry => entry.status.includes(selected));
  }

  onCancelClick() {
    this.newJournalEntryHidden = true;
    this.updateAccountForm = false;
  }

  onEntryButton() {
    this.newJournalEntryHidden = !this.newJournalEntryHidden;
  }

  onUpdateFormClick() {
    this.updateAccountForm = false;
    const accountNumber = ((document.getElementById('accountNumberField') as HTMLInputElement).value);
    const details = ((document.getElementById('ReasonForUpdate') as HTMLInputElement).value);
    this.systemAlertsForUsersService.logAlertWithAccountNumber(
        details, this.currentUser.username, Number(accountNumber)).pipe(first()).subscribe(() => {
    });
  }

  updateAccountButton() {
    this.updateAccountForm = !this.updateAccountForm;
  }

  allAccountsSorted() {
    this.accountList.sort((x, y) => {
      if (x.accountName < y.accountName) {
        return -1;
      }
      if (x.accountName > y.accountName) {
        return 1;
      }
      return 0;
    });

    return this.accountList;
  }

  approvedOrPendingSearch() {
    const search: string = (document.getElementById('myInput') as HTMLInputElement).value;
    if (search.length === 0 || search.length === null) {
      this.entriesList = this.entriesListBackup;
    } else {
      this.entriesList = this.entriesListBackup.filter(entry => entry.status.includes(search) || entry.createdBy.includes(search)
          || entry.description.includes(search) || entry.type.includes(search));
    }
  }

  pendingSearch() {
    const search: string = (document.getElementById('myInput') as HTMLInputElement).value;
    if (search.length === 0 || search.length === null) {
      this.allEntries = this.allEntriesBackup;
    } else {
      this.allEntries = this.allEntries.filter(entry => entry.status.includes(search) || entry.createdBy.includes(search)
          || entry.description.includes(search) || entry.type.includes(search));
    }
  }

  resetInput() {
    this.allEntries = this.allEntriesBackup;
    this.entriesList = this.entriesListBackup;
  }
}
