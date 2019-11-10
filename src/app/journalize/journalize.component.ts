import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { AlertService } from '../_services';
import { Router } from '@angular/router';
import { LogTrack, User } from '../_models';
import { ChartOfAccounts } from '../_models/chartOfAccounts';
import { JournalEntry } from '../_models/journal-entries';
import { ChartOfAccountsService } from '../_services/chart-of-accounts.service';
import { JournalEntryService } from '../_services/journal-entry.service';
import { SystemAlertsForUsersService } from '../_services/system-alerts-for-users.service';
import { LedgerService } from '../_services/ledger.service';
import { ToasterService } from '../_services/toast.service';
import { ToasterPosition } from '../_models/toaster-enum.position';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

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
  allEntriesBackup: JournalEntry[] = [];
  entriesListBackup: JournalEntry[] = [];
  approvedOrDeclinedEntries = false;
  updateAccountForm = false;
  submitButtonClicked = false;
  entriesList: JournalEntry[] = [];
  emptyDate = false;
  creditDebitUnbalanceError = false;
  creditDebitAccountNamesMatchError = false;
  negativeBalanceError = false;
  debitContainsNegativeError = false;
  creditContainsNegativeError = false;
  debitCreditAccountNamesMatchError = false;
  emptyInput = false;
  errorExistsInNewJournal = false;
  totalDebit = 0;
  totalCredit = 0;
  debitAccountsLists = [];
  creditAccountsLists = [];
  newJournalEntryHidden = true;
  listOfDebitAccountNames: string[] = [];
  listOfCreditAccountNames: string[] = [];
  listOfDebitAccountAmounts = [];
  listOfCreditAccountAmounts = [];
  Date = Date.now();
  specificAccountForReroute: ChartOfAccounts[] = [];
  image: {};

  constructor(private accountsService: ChartOfAccountsService,
              private journalEntryService: JournalEntryService,
              private router: Router,
              private alertService: AlertService,
              private alertsForUsersService: SystemAlertsForUsersService,
              private ledgerService: LedgerService,
              private toaster: ToasterService,
              private spinnerService: Ng4LoadingSpinnerService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.loadAllAccounts();
    this.loadAllJournalEntries();
    setInterval(() => {
      this.Date = Date.now();
    }, 1000);
  }

  addDebitRow() {
    this.debitAccountsLists.push({value: ''});
  }

  addCreditRow() {
    this.creditAccountsLists.push({value: ''});
  }

  private loadAllAccounts() {
    this.spinnerService.show();
    this.accountsService.getAll().pipe(first()).subscribe(account => {
      this.accountList = account;
      this.allAccounts = account;
      this.spinnerService.hide();
    });
  }

  private loadAllJournalEntries() {
    this.spinnerService.show();
    this.journalEntryService.getAll().pipe(first()).subscribe(entry => {
      this.allEntries = entry;
      this.allEntriesBackup = entry;
      this.entriesList = entry;
      this.entriesListBackup = entry;
      this.spinnerService.hide();
    });
  }
  async onSubmit() {
    this.submitButtonClicked = true;
    this.errorExistsInNewJournal = false;
    this.totalDebit = 0;
    this.totalCredit = 0;
    this.listOfDebitAccountNames = [];
    this.listOfCreditAccountNames = [];
    this.listOfDebitAccountAmounts = [];
    this.listOfCreditAccountAmounts = [];

    this.listOfDebitAccountNames.push(this.getAccountFromId((document.getElementById('debitAccountName') as
        HTMLInputElement).value).accountName);
    this.debitAccountsLists.forEach((item, index) => {
      this.listOfDebitAccountNames.push(this.getAccountFromId((document.getElementById('debitAccountName' + index) as
          HTMLInputElement).value).accountName);
    });
    this.listOfDebitAccountAmounts.push((document.getElementById('debitInput') as HTMLInputElement).value);
    this.debitAccountsLists.forEach((item, index) => {
      this.listOfDebitAccountAmounts.push(((document.getElementById('debitInput' + index) as HTMLInputElement).value));
    });

    this.listOfCreditAccountNames.push(this.getAccountFromId((document.getElementById('creditAccountName') as
        HTMLInputElement).value).accountName);
    this.creditAccountsLists.forEach((item, index) => {
      this.listOfCreditAccountNames.push(this.getAccountFromId((document.getElementById('creditAccountName' + index) as
          HTMLInputElement).value).accountName);
    });
    this.listOfCreditAccountAmounts.push((document.getElementById('creditInput') as HTMLInputElement).value);
    this.creditAccountsLists.forEach((item, index) => {
      this.listOfCreditAccountAmounts.push(((document.getElementById('creditInput' + index) as HTMLInputElement).value));
    });

    this.listOfDebitAccountAmounts.forEach((item) => {
      if (item.includes('-')) {
        this.debitContainsNegativeError = true;
        this.errorExistsInNewJournal = true;
        return;
      }
    });

    this.listOfCreditAccountAmounts.forEach((item) => {
      if (item.includes('-')) {
        this.creditContainsNegativeError = true;
        this.errorExistsInNewJournal = true;
        return;
      }
    });

    this.listOfDebitAccountAmounts.forEach((item) => {
      if (item === '0') {
        this.emptyInput = true;
        this.toaster.error('Credit and debit amounts must not be empty or Zero', 'error!', ToasterPosition.bottomRight);
        this.errorExistsInNewJournal = true;
        setTimeout(() => {
          this.emptyInput = false;
        }, 6000);
        return;
      }
    });

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

    this.listOfCreditAccountNames.forEach((accountCredit) => {
      this.listOfDebitAccountNames.forEach((accountDebit) => {
        if (accountDebit === accountCredit) {
          this.errorExistsInNewJournal = true;
          this.debitCreditAccountNamesMatchError = true;
          return;
        }
      });
    });

    this.listOfCreditAccountNames.forEach((accountCredit, index) => {
      this.listOfCreditAccountNames.forEach((accountDebit, index1) => {
        if (accountDebit === accountCredit && index !== index1) {
          this.errorExistsInNewJournal = true;
          this.debitCreditAccountNamesMatchError = true;
          return;
        }
      });
    });

    this.listOfDebitAccountNames.forEach((accountCredit, index) => {
      this.listOfDebitAccountNames.forEach((accountDebit, index1) => {
        if (accountDebit === accountCredit && index !== index1) {
          this.errorExistsInNewJournal = true;
          this.debitCreditAccountNamesMatchError = true;
          return;
        }
      });
    });

    this.listOfDebitAccountAmounts.forEach((amount) => {
      this.totalDebit += Number(amount);
    });

    this.listOfCreditAccountAmounts.forEach((amount) => {
      this.totalCredit += Number(amount);
    });

    if (this.debitContainsNegativeError || this.creditContainsNegativeError) {
      this.negativeBalanceError = true;
      this.toaster.error('Credit and Debit amounts must not be negative.', 'error!', ToasterPosition.bottomRight);
      setTimeout(() => {
        this.negativeBalanceError = false;
      }, 6000);
      this.debitContainsNegativeError = false;
      this.creditContainsNegativeError = false;
      this.submitButtonClicked = false;
      return;
    }

    if (this.debitCreditAccountNamesMatchError) {
      this.creditDebitAccountNamesMatchError = true;
      this.toaster.error('Credit and Debit accounts names must not match.', 'error!', ToasterPosition.bottomRight);
      setTimeout(() => {
        this.creditDebitAccountNamesMatchError = false;
      }, 6000);
      this.debitCreditAccountNamesMatchError = false;
      this.submitButtonClicked = false;
      return;
    }

    if (!this.errorCheck()) {
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
        newJournal.createdDate = new Date();
        newJournal.description = (document.getElementById('journalDescription') as HTMLInputElement).value;

        const files = (document.getElementById('myFile') as HTMLInputElement).files[0];

        if (files) {
          const x = await this.getBase64(files).then((data) => newJournal.imageData = data.toString());
          newJournal.imageName = files.name;
          newJournal.imageType = files.type;
        }
        this.spinnerService.show();
        this.journalEntryService.createNewEntry(newJournal).pipe(first())
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
                  this.toaster.success('Journal entry created!', 'success!', ToasterPosition.bottomRight);
                  this.router.navigate(['/journalize']);
                  this.spinnerService.hide();
                },
                error => {
                  this.submitButtonClicked = false;
                  this.alertService.error(error);
                });
      } else {
        this.submitButtonClicked = false;
        this.creditDebitUnbalanceError = true;
        this.toaster.error('Credits and Debits amounts must be equal.', 'error!', ToasterPosition.bottomRight);
        setTimeout(() => {
          this.creditDebitUnbalanceError = false;
        }, 6000);
      }
    } else {
      this.submitButtonClicked = false;
    }
  }

  getAccountFromId(accountId: string) {
    return this.allAccounts.find(x => x.id === accountId);
  }

  async getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror  = err => reject(err);
    });
  }

  updateJournalStatus(entry: JournalEntry, action: string) {
    if (action === 'approve') {
      this.updateAccountBalance(entry);
      this.toaster.success('Journal entry approved!', 'success!', ToasterPosition.bottomRight);
      entry.status = 'approved';
      const newLog = new LogTrack();
      newLog.logDataInput = 'Approved a journal entry ';
      newLog.logInitial =  entry.description + 'Status: Pending';
      newLog.logFinal =  entry.description + 'Status: Approved';
      this.spinnerService.show();
      this.journalEntryService.updateEntry(entry, newLog).pipe(first()).subscribe(() => {
        this.spinnerService.hide();
        this.loadAllJournalEntries();
      });
    } else {
      entry.status = 'declined';
      this.toaster.error('Journal entry rejected!', 'failure!', ToasterPosition.bottomRight);

      entry.declineReason = prompt('Enter Reason (if applicable):');
      const newLog = new LogTrack();
      newLog.logDataInput = 'Declines a journal entry with ' + 'debit account name: ' + entry.accountDebit + ' credit account name: '
          + entry.accountCredit;
      newLog.logInitial =  entry.description + 'Status: Pending';
      newLog.logFinal =  entry.description + 'Status: Declined';
      this.spinnerService.show();
      this.journalEntryService.updateEntry(entry, newLog).pipe(first()).subscribe(() => {
        this.spinnerService.hide();
        this.loadAllJournalEntries();
      });
    }
  }

  updateAccountBalance(journal: JournalEntry) {
    journal.accountDebit.forEach((account, index) => {
      this.spinnerService.show();
      this.ledgerService.createLedgerEntry(journal, account, journal.amountDebit[index], true )
          .pipe(first()).subscribe(() => {
            this.spinnerService.hide();
          });
      const debitAccount = this.allAccounts.filter(
          dataAccount => dataAccount.accountName.includes(journal.accountDebit[index]));
      this.updateDebitBalance(debitAccount[0], journal, index);
    });

    journal.accountCredit.forEach((account, index) => {
      this.ledgerService.createLedgerEntry(journal, account, journal.amountCredit[index], false ).pipe(first()).subscribe(() => {});
      const creditAccount = this.allAccounts.filter(
          dataAccount => dataAccount.accountName.includes(journal.accountCredit[index]));
      this.updateCreditBalance(creditAccount[0], journal, index);
    });
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

  updateDebitBalance(debitAccount: ChartOfAccounts, journal: JournalEntry, i: number) {
    const accountUpdate = debitAccount;
    if ((debitAccount.accountType === 'Expense' || debitAccount.accountType === 'Asset')
        && debitAccount.accountName !== 'Accumulated Depreciation') {
      accountUpdate.accountBalance +=  journal.amountDebit[i];

      const newLog = new LogTrack();
      newLog.logDataInput = 'Approved a journal that affected account ' + debitAccount.accountName;
      newLog.logInitial =  debitAccount.accountName + ': Pending';
      newLog.logFinal =  debitAccount.accountName + ': Approved';
      this.spinnerService.show();
      this.accountsService.updateAccount(accountUpdate, newLog).pipe(first()).subscribe(() => {
        this.spinnerService.hide();
      });
    } else {
      accountUpdate.accountBalance -=  journal.amountDebit[i];

      const newLog = new LogTrack();
      newLog.logDataInput = 'Approved a journal that affected account ' + debitAccount.accountName;
      newLog.logInitial =  debitAccount.accountName + ': Pending';
      newLog.logFinal =  debitAccount.accountName + ': Approved';
      this.spinnerService.show();
      this.accountsService.updateAccount(accountUpdate, newLog).pipe(first()).subscribe(() => {
        this.spinnerService.hide();
      });
    }
  }

  updateCreditBalance(creditAccount: ChartOfAccounts, journal: JournalEntry, i: number) {
    const accountUpdate = creditAccount;
    if ((creditAccount.accountType === 'Expense' || creditAccount.accountType === 'Asset') &&
        creditAccount.accountName !== 'Accumulated Depreciation') {
      accountUpdate.accountBalance -=  journal.amountCredit[i];

      const newLog = new LogTrack();
      newLog.logDataInput = 'Approved a journal that affected account ' + creditAccount.accountName;
      newLog.logInitial =  creditAccount.accountName + ': Pending';
      newLog.logFinal =  creditAccount.accountName + ': Approved';
      this.spinnerService.show();
      this.accountsService.updateAccount(accountUpdate, newLog).pipe(first()).subscribe(() => {
        this.spinnerService.hide();
      });
    } else {
      accountUpdate.accountBalance +=  journal.amountCredit[i];

      const newLog = new LogTrack();
      newLog.logDataInput = 'Approved a journal that affected account ' + creditAccount.accountName;
      newLog.logInitial =  creditAccount.accountName + ': Pending';
      newLog.logFinal =  creditAccount.accountName + ': Approved';
      this.spinnerService.show();
      this.accountsService.updateAccount(accountUpdate, newLog).pipe(first()).subscribe(() => {
        this.spinnerService.hide();
      });
    }
  }

  errorCheck() {
    return this.emptyDate || this.creditDebitUnbalanceError || this.creditDebitAccountNamesMatchError ||
        this.negativeBalanceError || this.debitContainsNegativeError || this.creditContainsNegativeError ||
        this.debitCreditAccountNamesMatchError || this.emptyInput || this.errorExistsInNewJournal;
  }

  onCancelClick() {
    this.debitCreditAccountNamesMatchError = false;
    this.creditDebitAccountNamesMatchError = false;
    this.newJournalEntryHidden = true;
    this.updateAccountForm = false;
  }

  onEntryButton() {
    this.newJournalEntryHidden = !this.newJournalEntryHidden;
  }

  setLedgerSortEntry(ledgerSortAccount: string, accountNumber: number) {
    this.specificAccountForReroute = this.accountList.filter(account => account.accountName === ledgerSortAccount);
    localStorage.setItem('accountSortBy', JSON.stringify(ledgerSortAccount));
    localStorage.setItem('accountNumber', JSON.stringify(this.specificAccountForReroute[0].accountNumber));
    this.router.navigate(['/ledger']);
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
      this.entriesList = this.entriesListBackup.filter(entry => entry.status.includes(search) ||
          entry.createdBy.includes(search) || entry.description.includes(search) || entry.type.includes(search));
      this.accountList.filter(account => account.accountName.includes(search));
    }
  }

  pendingSearch() {
    const search: string = (document.getElementById('myInput') as HTMLInputElement).value;
    if (search.length === 0 || search.length === null) {
      this.allEntries = this.allEntriesBackup;
    } else {
      this.allEntries = this.allEntries.filter(entry => entry.status.includes(search) ||
          entry.createdBy.includes(search) || entry.description.includes(search) || entry.type.includes(search));
      this.accountList.filter(account => account.accountName.includes(search));
    }
  }

  resetInput() {
    this.allEntries = this.allEntriesBackup;
    this.entriesList = this.entriesListBackup;
  }

  deleteFieldValue(index) {
    this.creditAccountsLists.splice(index, 1);
    this.debitAccountsLists.splice(index, 1);
  }
}

