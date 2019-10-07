import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LogTrack, User} from '../_models';
import { environment } from '../../environments/environment';
import { AccountPaginationResponse, ChartOfAccounts } from '../_models/chartOfAccounts';
import { LogTrackService } from './index';
import { forkJoin, Observable } from 'rxjs';

@Injectable()
export class ChartOfAccountsService {
  currentUser: User;

  constructor(private http: HttpClient, private logTrackService: LogTrackService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  getAllAccounts({ page, perPage, sortField, sortDir, filter }): Observable<AccountPaginationResponse> {
    let queryString = `${environment.apiUrl}/accounts?page=${page + 1}&perPage=${perPage}`;
    if (sortField && sortDir) {
      queryString = `${queryString}&sortField=${sortField}&sortDir=${sortDir}`;
    }
    if (filter) {
      queryString = `${queryString}&filter=${filter}`;
    }
    return this.http.get<AccountPaginationResponse>(queryString);
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
      const createAccountRequest = this.http.put(`${environment.apiUrl}/accounts/` + account._id, account);
      return forkJoin([messageLog, createAccountRequest]);
    }
  }

  delete(id: string): Observable<ChartOfAccounts> {
      return this.http.delete<ChartOfAccounts>(`${environment.apiUrl}/accounts/${id}`);
  }

  getAccountById(id: string): Observable<ChartOfAccounts> {
    console.log('get by id: ' +  this.http.get<ChartOfAccounts>(`${environment.apiUrl}/createAccount/${id}`));
    return this.http.get<ChartOfAccounts>(`${environment.apiUrl}/accounts/${id}`);
  }

  updateAccountById(id: string, body: ChartOfAccounts, message: LogTrack) {
    if (this.currentUser.role === '1' || this.currentUser.role === '2') {
      const messageLog = this.logTrackService.logData(message, this.currentUser.username);
      const updatedAccount = this.http.put(`${environment.apiUrl}/accounts/${id}`, body);
      return forkJoin([messageLog, updatedAccount]);
    }
  }

  downloadAccount(id: string) {
    return this.http.get(`${environment.apiUrl}/accounts/${id}/download`, {
      responseType: 'blob' // blob response type used to read binary data
    });
  }
}
