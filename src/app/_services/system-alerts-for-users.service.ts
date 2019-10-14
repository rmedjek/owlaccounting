import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import {User} from '../_models';
import { SystemAlertsForUsers } from '../_models/SystemAlertsForUsers';

@Injectable()
export class SystemAlertsForUsersService {
  currentUser: User;
  constructor(private http: HttpClient) {
  }

  getAll() {
    return this.http.get<SystemAlertsForUsers[]>(`${environment.apiUrl}/systemAlerts`);
  }


  logAlert(message: string, username: string) {
    const alert = new SystemAlertsForUsers();
    alert.createdBy = username;
    alert.alertDetail = message;
    return this.http.post(`${environment.apiUrl}/systemAlerts/logAlert`, alert);
  }

  logAlertWithAccountNumber(message: string, username: string, accountNumber: number) {
    const alert = new SystemAlertsForUsers();
    alert.createdBy = username;
    alert.accountNumber = accountNumber;
    alert.alertDetail = message;
    return this.http.post(`${environment.apiUrl}/systemAlerts/logAlert`, alert);
  }

  updateEntry(alert: SystemAlertsForUsers) {
    return this.http.put(`${environment.apiUrl}/systemAlerts/` + alert.id, alert);
  }
}
