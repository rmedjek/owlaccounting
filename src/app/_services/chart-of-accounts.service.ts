import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LogTrack, User} from '../_models';
import { environment } from '../../environments/environment';
import { ChartOfAccounts } from '../_models/chartOfAccounts';
import { LogTrackService } from './index';
import { forkJoin } from 'rxjs';

@Injectable()
export class ChartOfAccountsService {
  currentUser: User;
  constructor(private http: HttpClient, private logTrackService: LogTrackService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  getAllAccounts() {
    return this.http.get<ChartOfAccounts[]>(`${environment.apiUrl}/accounts`);
  }

  createAccount(account: ChartOfAccounts, currentUser: User) {
    if (currentUser.role === '1') {
      account.createdBy = currentUser.username;

      const newLog = new LogTrack();
      newLog.logDataInput = 'Created a new account ' + account.accountName;
      newLog.logInitial = '';
      newLog.logFinal = account.accountName;
      const messageLog = this.logTrackService.logData(newLog, this.currentUser.username);
      const createAccountRequest = this.http.post(`${environment.apiUrl}/accounts/createAccount`, account);
      return forkJoin([messageLog, createAccountRequest]);
    }
  }

  updateAccount(account: ChartOfAccounts, message: LogTrack) {
    if (this.currentUser.role === '1' || this.currentUser.role === '2') {
      const messageLog = this.logTrackService.logData(message, this.currentUser.username);
      const createAccountRequest = this.http.put(`${environment.apiUrl}/accounts/` + account.id, account);
      return forkJoin([messageLog, createAccountRequest]);
    }
  }
}
