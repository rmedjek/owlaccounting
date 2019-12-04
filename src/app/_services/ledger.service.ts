import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Ledger } from '../_models/ledger';
import { JournalEntry } from '../_models/journal-entries';
import { ChartOfAccounts } from '../_models/chartOfAccounts';

@Injectable()
export class LedgerService {
  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<Ledger[]>(`${environment.apiUrl}/ledger`);
  }

  createLedgerEntry(entry: JournalEntry, accountName: string, amount: number, accountDebit: boolean) {
    const ledger = new Ledger();
    ledger.accountName = accountName;
    ledger.accountDebit = accountDebit;
    ledger.entryType = entry.type;
    ledger.amount = amount;
    ledger.createdDate = entry.createdDate;
    ledger.description = entry.description;
    ledger.journalId = entry.id;
    ledger.prId = entry.journalId;
    return this.http.post(`${environment.apiUrl}/ledger/newEntry`, ledger);
  }
}
