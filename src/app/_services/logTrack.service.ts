import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { logTrack } from '../_models';

@Injectable()
export class LogTrackService {
  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<logTrack[]>(`${environment.apiUrl}/logTrack`);
  }

  logData(message: logTrack, user: string) {
    message.createdBy = user;
    return this.http.post(`${environment.apiUrl}/logTrack/logData`, message);
  }
}
