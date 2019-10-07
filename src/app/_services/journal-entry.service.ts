import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LogTrack, User } from '../_models';
import { environment } from '../../environments/environment';
import { LogTrackService } from './index';
import { JournalEntry } from '../_models/journal-entries';
import { forkJoin } from 'rxjs';

@Injectable()
export class JournalEntryService {
  currentUser: User;

  constructor(private http: HttpClient,
              private logService: LogTrackService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  getAll() {
    return this.http.get<JournalEntry[]>(`${environment.apiUrl}/journals`);
  }

  createEntry(entry: JournalEntry) {
    if (this.currentUser.role === '3' || this.currentUser.role === '2') {
      const newLog = new LogTrack();
      newLog.logDataInput = 'Created a new journal Entry on ' +
        entry.createdDate.getDate() + '/'
        + entry.createdDate.getMonth() + '/'
        + entry.createdDate.getFullYear() + ' '
        + entry.createdDate.getHours() + ':'
        + entry.createdDate.getMinutes() + ':'
        + entry.createdDate.getSeconds();
      newLog.logInitial = '';
      newLog.logFinal = entry.description;

      const messageLog = this.logService.logData(newLog, this.currentUser.username);
      const createEntryRequest = this.http.post(`${environment.apiUrl}/journals/createEntry`, entry);
      return forkJoin([messageLog, createEntryRequest]);
    }
  }

  updateEntry(entry: JournalEntry, message: LogTrack) {
    if (this.currentUser.role === '3' || this.currentUser.role === '2') {
      const messageLog = this.logService.logData(message, this.currentUser.username);
      const createAccountRequest = this.http.put(`${environment.apiUrl}/journals/` + entry.id, entry);
      return forkJoin([messageLog, createAccountRequest]);
    }
  }
}
