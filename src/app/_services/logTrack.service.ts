import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { LogTrack } from '../_models';

@Injectable()
export class LogTrackService {
  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<LogTrack[]>(`${environment.apiUrl}/logTrack`);
  }

  logData(message: LogTrack, user: string) {
    message.createdBy = user;
    return this.http.post(`${environment.apiUrl}/logTrack/logData`, message);
  }
}
