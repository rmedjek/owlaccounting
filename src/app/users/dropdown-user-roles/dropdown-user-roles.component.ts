import {Component, Input, OnInit} from '@angular/core';
import { first } from 'rxjs/operators';

import { LogTrack, User} from '../../_models';
import { UserService } from '../../_services';

@Component({
  selector: 'app-dropdown-user-roles',
  templateUrl: './dropdown-user-roles.component.html',
  styleUrls: ['./dropdown-user-roles.component.css']
})
export class DropdownUserRolesComponent implements OnInit {
  currentUser: User;

  @Input()
  user: User;

  constructor(private userService: UserService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  onOptionSelect(selected: string, user: User) {
    if (this.currentUser.role === '1') {
      const newLog = new LogTrack();
      newLog.logDataInput = 'Changed the status of user ' + user.username + ' to ' + this.userRole(selected);
      newLog.logInitial =  user.username + ' status: ' +  this.userRole(user.role);
      newLog.logFinal =  user.username + ' status: ' + this.userRole(selected);
      user.role = selected;
      this.userService.update(user, this.currentUser, newLog).pipe(first()).subscribe(() => {
      });
    }
  }

  public userRole(role) {
    if (role === '1') {
      return 'admin';
    } else if (role !== '2') {
      return 'User';
    } else {
      return 'manager';
    }
  }

  ngOnInit() {
  }
}
