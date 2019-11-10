import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AlertService} from '../_services';
import {first} from 'rxjs/operators';
import { Ledger } from '../_models/ledger';
import { JournalEntry } from '../_models/journal-entries';
import { LedgerService } from '../_services/ledger.service';
import { JournalEntryService } from '../_services/journal-entry.service';
import { ChartOfAccounts } from '../_models/chartOfAccounts';
import { ChartOfAccountsService } from '../_services/chart-of-accounts.service';


@Component({
  selector: 'app-account-specific-transactions',
  templateUrl: './ledger-account-transactions.component.html',
  styleUrls: ['./ledger-account-transactions.component.css']
})
export class LedgerAccountTransactionsComponent implements OnInit {
  allEntries: Ledger[] = [];
  accountSpecificEntries: Ledger[] = [];
  allJournalEntries: JournalEntry[] = [];
  specificJournalEntry: JournalEntry[] = [];
  accountList: ChartOfAccounts[] = [];
  journalEntryDisplay = false;
  accountName = JSON.parse(localStorage.getItem('accountSortBy'));
  accountNumber = JSON.parse(localStorage.getItem('accountNumber'));

  constructor( private ledgerService: LedgerService,
               private router: Router,
               private alertService: AlertService,
               private journalEntryService: JournalEntryService,
               private  accountService: ChartOfAccountsService) { }

  ngOnInit() {
    this.loadAllSpecificEntries();
    this.loadAllJournalEntries();
    this.loadAllAccounts();
  }

  private loadAllSpecificEntries() {
    this.ledgerService.getAll().pipe(first()).subscribe(entry => {
      this.allEntries = entry;
    });
  }

  private loadAllJournalEntries() {
    this.journalEntryService.getAll().pipe(first()).subscribe(entry => {
      this.allJournalEntries = entry;
    });
  }

  private loadAllAccounts() {
    this.accountService.getAll().pipe(first()).subscribe(account => {
      this.accountList = account;
    });
  }

  filterItemList(entries: Ledger[]) {
    this.accountSpecificEntries  = this.allEntries.filter(entry => entry.accountName === JSON.parse(localStorage.getItem('accountSortBy')));
    this.accountSpecificEntries.sort((x, y) => {
      // true values first
      return (x === y) ? 0 : x ? -1 : 1;
      // false values first
      // return (x === y)? 0 : x? 1 : -1;
    });
    return this.accountSpecificEntries;
  }

  referenceJournal(reference: string) {
  this.journalEntryDisplay = true;
  this.specificJournalEntry = this.allJournalEntries.filter(entry => entry.id === reference);
  return this.specificJournalEntry;
  }

  onBackClick() {
    this.journalEntryDisplay = false;
  }
}
