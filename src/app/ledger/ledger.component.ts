import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Ledger } from '../_models/ledger';
import { LedgerService } from '../_services/ledgerService.service';
import { JournalEntry } from '../_models/journal-entries';
import { JournalEntryService } from '../_services/journal-entry.service';

@Component({
  selector: 'app-ledger',
  templateUrl: './ledger.component.html',
  styleUrls: ['./ledger.component.css']
})
export class LedgerComponent implements OnInit {
  ledgerList: JournalEntry[] = [];
  journalEntries: JournalEntry[] = [];
  isDisplayed = false;


  constructor( private  ledgerService: LedgerService,
    private journalEntryService: JournalEntryService,
                private router: Router,) {

   }

  ngOnInit() {
    this.loadLedgerEntries();
    this.loadJournalEntries();
  }

  private loadLedgerEntries() {
    this.ledgerService.getAll().pipe(first()).subscribe(ledger => {
      this.ledgerList = ledger;
    });
  }

  private loadJournalEntries() {
    this.journalEntryService.getAll().pipe(first()).subscribe(entry => {
      this.journalEntries = entry;
    });
  } 
}
