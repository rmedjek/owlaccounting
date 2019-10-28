import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AlertService} from '../_services';
import {first} from 'rxjs/operators';
import { Ledger } from '../_models/ledger';
import { JournalEntry } from '../_models/journal-entries';
import { LedgerService } from '../_services/ledger.service';
import { JournalEntryService } from '../_services/journal-entry.service';
import {FormControl} from '@angular/forms';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';

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
  journalEntryDisplay = false;
  accountName = JSON.parse(localStorage.getItem('accountSortBy'));
  accountNumber = JSON.parse(localStorage.getItem('accountNumber'));

  constructor( private ledgerService: LedgerService,
               private router: Router,
               private alertService: AlertService,
               private journalEntryService: JournalEntryService) { }

  ngOnInit() {
    this.loadAllSpecificEntries();
    this.loadAllJournalEntries();
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

  filterDates(event: MatDatepickerInputEvent<Date>){
    this.ledgerService.getAll().pipe(first()).subscribe(entry => {
      this.allEntries = entry;
      this.allEntries = this.allEntries.filter(entry => entry.createdDate.toString().slice(8, 10)  === `${event.value.toString().slice(8, 10)}`);

    return this.allEntries;
    })
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
