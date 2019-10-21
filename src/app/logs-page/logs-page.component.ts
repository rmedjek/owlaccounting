import {Component, OnInit} from '@angular/core';
import {LogTrackService} from '../_services';
import {LogTrack, User} from '../_models';
import {first} from 'rxjs/operators';
import { ToasterService } from '../_services/toast.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-logs-page',
  templateUrl: './logs-page.component.html',
  styleUrls: ['./logs-page.component.css']
})
export class LogsPageComponent implements OnInit {
  currentUser: User;
  logsOfData: LogTrack[] = [];
  allLogOfData: LogTrack[] = [];
  sortTracker = 0;

  constructor(private logTrackService: LogTrackService,
              private spinnerService: Ng4LoadingSpinnerService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.loadAllLogs();
  }

  private loadAllLogs() {
    this.spinnerService.show();
    this.logTrackService.getAll().pipe(first()).subscribe(logData => {
      this.logsOfData = logData;
      this.allLogOfData = logData;
      this.spinnerService.hide();
    });
  }

  public loadLogsBySearch() {
    this.logsOfData = this.allLogOfData;
    const search: string = (document.getElementById('myInput') as HTMLInputElement).value;
    if (search.length === 0 || search.length === null) {
      this.logsOfData = this.allLogOfData;
    } else {
        this.logsOfData = this.logsOfData.filter(logOfData => (logOfData.logDataInput.includes(search)
            || logOfData.createdBy.includes(search)));
    }
  }

  public sortByUser() {
    if (this.sortTracker === 0) {
      this.logsOfData.sort( (x, y) => {
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
      this.logsOfData.sort((x, y) => {
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
      this.logsOfData.sort((x, y) =>  {
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
      this.logsOfData.sort((x, y) =>  {
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
      this.logsOfData.sort((x, y) => {
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
      this.logsOfData.sort((x, y) => {
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
