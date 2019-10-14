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
import { MatSnackBar } from '@angular/material';

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
  creditDebitAccountMatchError = false;
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
              public snackBar: MatSnackBar) {
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
    this.accountsService.getAll().pipe(first()).subscribe(account => {
      this.accountList = account;
      this.allAccounts = account;
    });
  }

  private loadAllJournalEntries() {
    this.journalEntryService.getAll().pipe(first()).subscribe(entry => {
      this.allEntries = entry;
      this.allEntriesBackup = entry;
      this.entriesList = entry;
      this.entriesListBackup = entry;
    });
  }
  async onSubmit() {
    this.addDebitAccountNameToDebitAccountNamesList();
    this.getElementByDebitAccountName();
    this.getElementByDebitInput();
    this.getElementByCreditAccountName();
    this.getElementByCreditInput();
    this.isDebitAccAmountNegative();
    this.isCreditAccAmountNegative();
    this.isDebitAccountAmountsZero();
    this.isCreditAccountAmountsZero();
    this.isDebitAccountAmountsEmpty();
    this.isCreditAccountAmountsEmpty();
    this.isAccountDebitAndCreditNamesMatch();
    this.isCreditAccountNamesMatch();
    this.isDebitAccountsNameMatch();
    this.addAmountToTotalDebit();
    this.addAmountToTotalCredit();
    this.isDebitOrCreditAccountsContainsNegativeErrors();
    this.isDebitAndCreditAccountSame();
    this.logNewEntry();
  }

  private addDebitAccountNameToDebitAccountNamesList() {
    this.listOfDebitAccountNames.push(this.getAccountFromId(
        (document.getElementById('debitAccountName') as HTMLInputElement).value).accountName);
  }

  private getElementByDebitAccountName() {
    this.debitAccountsLists.forEach((item, index) => {
      this.listOfDebitAccountNames.push(this.getAccountFromId(
          (document.getElementById('debitAccountName' + index) as HTMLInputElement).value).accountName);
    });
  }

  private getElementByDebitInput() {
    this.listOfDebitAccountAmounts.push((document.getElementById('debitInput') as HTMLInputElement).value);
    this.debitAccountsLists.forEach((item, index) => {
      this.listOfDebitAccountAmounts.push(((document.getElementById('debitInput' + index) as HTMLInputElement).value));
    });
  }

  private getElementByCreditAccountName() {
    this.listOfCreditAccountNames.push(this.getAccountFromId(
        (document.getElementById('creditAccountName') as HTMLInputElement).value).accountName);
    this.creditAccountsLists.forEach((item, index) => {
      this.listOfCreditAccountNames.push(
          this.getAccountFromId((document.getElementById('creditAccountName' + index) as HTMLInputElement).value).accountName);
    });
  }

  private getElementByCreditInput() {
    this.listOfCreditAccountAmounts.push(
        (document.getElementById('creditInput') as HTMLInputElement).value);
    this.creditAccountsLists.forEach((item, index) => {
      this.listOfCreditAccountAmounts.push(((document.getElementById('creditInput' + index) as HTMLInputElement).value));
    });
  }

  private isDebitAccAmountNegative() {
    this.listOfDebitAccountAmounts.forEach((account) => {
      if (account.includes('-')) {
        this.debitContainsNegativeError = true;
        this.errorExistsInNewJournal = true;
        return;
      }
    });
  }

  private isCreditAccAmountNegative() {
    this.listOfCreditAccountAmounts.forEach((account) => {
      if (account.includes('-')) {
        this.creditContainsNegativeError = true;
        this.errorExistsInNewJournal = true;
        return;
      }
    });
  }

  private isDebitAccountAmountsZero() {
    this.listOfDebitAccountAmounts.forEach((account) => {
      if (account === '0') {
        this.emptyInput = true;
        this.errorExistsInNewJournal = true;
        setTimeout(() => {
          this.emptyInput = false;
        }, 6000);
        return;
      }
    });
  }

  private isCreditAccountAmountsZero() {
    this.listOfCreditAccountAmounts.forEach((account) => {
      if (account === '0') {
        this.emptyInput = true;
        this.errorExistsInNewJournal = true;
        setTimeout(() => {
          this.emptyInput = false;
        }, 6000);
        return;
      }
    });
  }

  private isDebitAccountAmountsEmpty() {
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

  private isCreditAccountAmountsEmpty() {
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

  private isAccountDebitAndCreditNamesMatch() {
    this.listOfCreditAccountNames.forEach((accountCredit) => {
      this.listOfDebitAccountNames.forEach((accountDebit) => {
        if (accountDebit === accountCredit) {
          this.errorExistsInNewJournal = true;
          this.debitCreditAccountNamesMatchError = true;
          return;
        }
      });
    });
  }

  private isCreditAccountNamesMatch() {
    this.listOfCreditAccountNames.forEach((accountCredit, index) => {
      this.listOfCreditAccountNames.forEach((accountDebit, index1) => {
        if (accountDebit === accountCredit && index !== index1) {
          this.errorExistsInNewJournal = true;
          this.debitCreditAccountNamesMatchError = true;
          return;
        }
      });
    });
  }

  private isDebitAccountsNameMatch() {
    this.listOfDebitAccountNames.forEach((accountCredit, index) => {
      this.listOfDebitAccountNames.forEach((accountDebit, index1) => {
        if (accountDebit === accountCredit && index !== index1) {
          this.errorExistsInNewJournal = true;
          this.debitCreditAccountNamesMatchError = true;
          return;
        }
      });
    });
  }

  private addAmountToTotalDebit() {
    this.listOfDebitAccountAmounts.forEach((amount) => {
      this.totalDebit += Number(amount);
    });
  }

  private addAmountToTotalCredit() {
    this.listOfCreditAccountAmounts.forEach((amount) => {
      this.totalCredit += Number(amount);
    });
  }

  private isDebitOrCreditAccountsContainsNegativeErrors() {
    if (this.debitContainsNegativeError || this.creditContainsNegativeError) {
      this.negativeBalanceError = true;
      setTimeout(() => {
        this.negativeBalanceError = false;
      }, 6000);
      this.debitContainsNegativeError = false;
      this.creditContainsNegativeError = false;
      return;
    }
  }

  private isDebitAndCreditAccountSame() {
    if (this.debitCreditAccountNamesMatchError) {
      this.creditDebitAccountMatchError = true;
      setTimeout(() => {
        this.creditDebitAccountMatchError = false;
      }, 6000);
      this.debitCreditAccountNamesMatchError = false;
      this.submitButtonClicked = false;
      return;
    }
  }

  private async logNewEntry() {
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
        // newJournal.createdDate = (dateInputted);
        newJournal.createdDate = new Date();
        newJournal.description = (document.getElementById('journalDescription') as HTMLInputElement).value;

        // const files = (document.getElementById('myFile') as HTMLInputElement).files[0];
        //
        // if (files) {
        //   const x = await this.getBase64(files).then((data) => newJournal.imageData = data.toString());
        //   console.log('constant: ' + x);
        //   newJournal.imageName = files.name;
        //   newJournal.imageType = files.type;
        // }

        this.journalEntryService.logNewEntry(newJournal).pipe
        (first())
            .subscribe(data => {
              this.debitAccountsLists = [];
              this.creditAccountsLists = [];
              this.loadAllJournalEntries();
              this.debitAccountsLists.forEach((item, index) => {
                if (index !== 0) {
                  item.pop();
                }
              });
              this.submitButtonClicked = false;
              this.snackBar.open('Journal Created', 'success', {
                duration: 6000
              });
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
      entry.status = 'approved';

      const newLog = new LogTrack();
      newLog.logDataInput = 'Approved a journal entry ';
      newLog.logInitial =  entry.description + 'Status: Pending';
      newLog.logFinal =  entry.description + 'Status: Approved';

      this.journalEntryService.updateEntry(entry, newLog).pipe(first()).subscribe(() => {
        this.loadAllJournalEntries();
      });
    } else {
      entry.status = 'declined';
      entry.declineReason = prompt('Enter Reason (if applicable):');
      const newLog = new LogTrack();
      newLog.logDataInput = 'Declines a journal entry ';
      newLog.logInitial =  entry.description + 'Status: Pending';
      newLog.logFinal =  entry.description + 'Status: Declined';

      this.journalEntryService.updateEntry(entry, newLog).pipe(first()).subscribe(() => {
        this.loadAllJournalEntries();
      });
    }
  }

  updateAccountBalance(journal: JournalEntry) {
    journal.accountDebit.forEach((account, index) => {
      this.ledgerService.createLedgerEntry(
          journal, account, journal.amountDebit[index], true ).pipe(first()).subscribe(() => {});
      const debitAccount = this.allAccounts.filter(debitAccount => debitAccount.accountName.includes(journal.accountDebit[index]));
      this.updateDebitBalance(debitAccount[0], journal, index);
    });

    journal.accountCredit.forEach((account, index) => {
      this.ledgerService.createLedgerEntry(journal, account, journal.amountCredit[index], false ).pipe(first()).subscribe(() => {});
      const creditAccount = this.allAccounts.filter(
          creditAccount => creditAccount.accountName.includes(journal.accountCredit[index]));
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

      this.accountsService.updateAccount(accountUpdate, newLog).pipe(first()).subscribe(() => {
      });
    } else {
      accountUpdate.accountBalance -=  journal.amountDebit[i];

      const newLog = new LogTrack();
      newLog.logDataInput = 'Approved a journal that affected account ' + debitAccount.accountName;
      newLog.logInitial =  debitAccount.accountName + ': Pending';
      newLog.logFinal =  debitAccount.accountName + ': Approved';

      this.accountsService.updateAccount(accountUpdate, newLog).pipe(first()).subscribe(() => {
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
      this.accountsService.updateAccount(accountUpdate, newLog).pipe(first()).subscribe(() => {
      });
    } else {
      accountUpdate.accountBalance +=  journal.amountCredit[i];

      const newLog = new LogTrack();
      newLog.logDataInput = 'Approved a journal that affected account ' + creditAccount.accountName;
      newLog.logInitial =  creditAccount.accountName + ': Pending';
      newLog.logFinal =  creditAccount.accountName + ': Approved';
      this.accountsService.updateAccount(accountUpdate, newLog).pipe(first()).subscribe(() => {
      });
    }
  }

  errorCheck() {
    return this.emptyDate || this.creditDebitUnbalanceError || this.creditDebitAccountMatchError ||
        this.negativeBalanceError || this.debitContainsNegativeError || this.creditContainsNegativeError ||
        this.debitCreditAccountNamesMatchError || this.emptyInput || this.errorExistsInNewJournal;
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
    this.alertsForUsersService.logAlertWithAccountNumber(
        details, this.currentUser.username, Number(accountNumber)).pipe(first()).subscribe(() => {
    });
  }

  updateAccountButton() {
    this.updateAccountForm = !this.updateAccountForm;
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
}

