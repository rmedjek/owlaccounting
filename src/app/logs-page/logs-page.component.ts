import { Component, OnInit } from '@angular/core';
import { LogTrackService} from '../_services';
import { logTrack, User} from '../_models';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-logs-page',
  templateUrl: './logs-page.component.html',
  styleUrls: ['./logs-page.component.css']
})
export class LogsPageComponent implements OnInit {
  currentUser: User;
  logsOfData: logTrack[] = [];
  allLogOfData: logTrack[] = [];
  sortTracker = 0;

  constructor(private logTrackService: LogTrackService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.loadAllLogs();
  }

  private loadAllLogs() {
    this.logTrackService.getAll().pipe(first()).subscribe(logData => {
      this.logsOfData = logData;
      this.allLogOfData = logData;
    });
  }

  public loadLogsBySearch() {
    this.logsOfData = this.allLogOfData;
    const search: string = (<HTMLInputElement>document.getElementById('myInput')).value;
    if (search.length === 0 || search.length === null) {
      this.logsOfData = this.allLogOfData;
    } else {
      const result = this.logsOfData.filter(logOfData => (logOfData.logDataInput.includes(search) || logOfData.createdBy.includes(search)));
      this.logsOfData = result;
    }
  }

  public sortByUser() {
    if (this.sortTracker === 0) {
      this.logsOfData.sort(function (x, y) {
        if (x.createdBy < y.createdBy) {
          return -1;
        }
        if (x.createdBy > y.createdBy) {
          return 1;
        }
        return 0;
      });
      this.sortTracker = 1;
    } else {
      this.logsOfData.sort(function (x, y) {
        if (x.createdBy > y.createdBy) {
          return -1;
        }
        if (x.createdBy < y.createdBy) {
          return 1;
        }
        return 0;
      });
      this.sortTracker = 0;
    }
  }

  public sortByEvent() {
    if (this.sortTracker === 0) {
      this.logsOfData.sort(function (x, y) {
        if (x.logDataInput < y.logDataInput) {
          return -1;
        }
        if (x.logDataInput > y.logDataInput) {
          return 1;
        }
        return 0;
      });
      this.sortTracker = 1;
    } else {
      this.logsOfData.sort(function (x, y) {
        if (x.logDataInput > y.logDataInput) {
          return -1;
        }
        if (x.logDataInput < y.logDataInput) {
          return 1;
        }
        return 0;
      });
      this.sortTracker = 0;
    }
  }

  public sortByDate() {
    if (this.sortTracker === 0) {
      this.logsOfData.sort(function (x, y) {
        if (x.dateTimeOfEvent < y.dateTimeOfEvent) {
          return -1;
        }
        if (x.dateTimeOfEvent > y.dateTimeOfEvent) {
          return 1;
        }
        return 0;
      });
      this.sortTracker = 1;
    } else {
      this.logsOfData.sort(function (x, y) {
        if (x.dateTimeOfEvent > y.dateTimeOfEvent) {
          return -1;
        }
        if (x.dateTimeOfEvent < y.dateTimeOfEvent) {
          return 1;
        }
        return 0;
      });
      this.sortTracker = 0;
    }
  }

  public resetInput() {
    this.loadAllLogs();
  }
}
