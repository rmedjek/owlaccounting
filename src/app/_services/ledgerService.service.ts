import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { JournalEntry } from '../_models/journal-entries';
import { Ledger } from '../_models/ledger';


@Injectable()
export class LedgerService {
  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<JournalEntry[]>(`${environment.apiUrl}/ledger`);
  }


  logTableEntry(entry: JournalEntry, accountName: string, amount: number, accountDebit: boolean) {
    const ledger = new Ledger();
    ledger.accountName = accountName;
    ledger.accountDebit = accountDebit;
    ledger.entryType = entry.type;
    ledger.amount = amount;
    ledger.createdDate = entry.createdDate;
    ledger.description = entry.description;
    ledger.journalId = entry.id;

    return this.http.post(`${environment.apiUrl}/ledger/newEntry`, ledger);
  }
}
