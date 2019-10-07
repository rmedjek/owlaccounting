import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError, forkJoin } from 'rxjs';

import { environment } from '../../environments/environment';
import { LogTrack, User } from '../_models';
import { LogTrackService } from './logTrack.service';


@Injectable()
export class UserService {
    constructor(private http: HttpClient, private logService: LogTrackService) { }

    getAll() {
        return this.http.get<User[]>(`${environment.apiUrl}/users`);
    }

    getById(id: number) {
        return this.http.get(`${environment.apiUrl}/users/` + id);
    }

    register(user: User) {
      user.accountActive = false;
      // user.passwordExpired = false;
      user.role = '3';
      return this.http.post(`${environment.apiUrl}/users/register`, user);
    }

    createUser(user: User, currentUser: User) {
        if (currentUser.role === '1') {
            user.accountActive = false;
            user.role = '3';

            const newLog = new LogTrack();
            newLog.logDataInput = 'Created a new user ' + user.username;
            newLog.logInitial =  '';
            newLog.logFinal =  user.username;

            const messageLog = this.logService.logData(newLog, currentUser.username);
            const createUser = this.http.post(`${environment.apiUrl}/users/register`, user);
            return forkJoin([messageLog, createUser]);
        } else {
            throwError('You are not authorized to perform this action!');
        }
    }

    update(user: User, currentUser: User, message: LogTrack) {
        if (currentUser.role === '1') {
            const messageLog = this.logService.logData(message, currentUser.username);
            const updateData = this.http.put(`${environment.apiUrl}/users/` + user.id, user);
            return forkJoin([messageLog, updateData]);
        } else {
            throwError('You are not authorized to perform this action!');
        }
    }

    delete(id: number) {
        return this.http.delete(`${environment.apiUrl}/users/` + id);
    }
}

