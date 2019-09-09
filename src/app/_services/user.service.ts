import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { User} from '../_models';
import { Observable, throwError, forkJoin } from 'rxjs';

@Injectable()
export class UserService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<User[]>(`${environment.apiUrl}/users`);
    }

    getById(id: number) {
        return this.http.get(`${environment.apiUrl}/users/` + id);
    }

    register(user: User) {
      user.accountActive = false;
      user.role = '3';
      return this.http.post(`${environment.apiUrl}/users/register`, user);
    }

    createUser(user: User, currentUser: User) {
      if (currentUser.role === '1') {
        user.accountActive = false;
        user.role = '3';

        const createUser = this.http.post(`${environment.apiUrl}/users/register`, user);
        return forkJoin([createUser]);
      } else {
          throwError('You are not authorized to perform this action!');
      }
    }

    update(user: User, currentUser: User) {
      if (currentUser.role === '1') {
      const updateData = this.http.put(`${environment.apiUrl}/users/` + user.id, user);
      return forkJoin([updateData]);
      } else {
        throwError('You are not authorized to perform this action!');
      }
    }

    delete(id: number) {
        return this.http.delete(`${environment.apiUrl}/users/` + id);
    }
}

