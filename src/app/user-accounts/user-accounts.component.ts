import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { LogTrack, User } from '../_models';
import { UserService } from '../_services';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-chart-of-user-accounts',
  templateUrl: './user-accounts.component.html',
  styleUrls: ['./user-accounts.component.css']
})
export class UserAccountsComponent implements OnInit {
  currentUser: User;
  users: User[] = [];
  allUsers: User[] = [];
  sortTracker = 0;
  editField: string;

  constructor(private userService: UserService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.loadAllUsers();
  }

  // in case we need to delete the user
  deleteUser(id: number) {
    this.userService.delete(id).pipe(first()).subscribe(() => {
      this.loadAllUsers();
    });
  }

  deactivateUser(user: User, currentUser: User) {
    if (currentUser.role === '1') {
      user.accountActive = false;
      const newLog = new LogTrack();
      newLog.logDataInput = 'Deactivated user ' + user.username;
      newLog.logInitial =  user.username + ': Active';
      newLog.logFinal =  user.username + ': Deactivate';
      this.userService.update(user, currentUser, newLog).pipe(first()).subscribe(() => {
        this.loadAllUsers();
      });
    }
  }

  activateUser(user: User, currentUser: User) {
    if (currentUser.role === '1') {
      user.accountActive = true;
      const newLog = new LogTrack();
      newLog.logDataInput = 'Activated user ' + user.username;
      newLog.logInitial =  user.username + ': Deactivate';
      newLog.logFinal =  user.username + ': Active';
      this.userService.update(user, currentUser, newLog).pipe(first()).subscribe(() => {
        this.loadAllUsers();
      });
    }
  }

  resetPassword(user: User, currentUser: User) {
    if (this.currentUser.role === '1') {
      const passwordInput = prompt('Enter New Password:');
      if (passwordInput !== null && passwordInput !== '') {
         if (passwordInput.length > 6) {
           const newLog = new LogTrack();
           newLog.logDataInput = 'Changed the password of user: ' + user.username;
           newLog.logInitial =  user.username + ' password: *******';
           newLog.logFinal =  user.username + ' password: *******';
           user.password = passwordInput.toString();
           this.userService.update(user, currentUser, newLog).pipe(first()).subscribe(() => {
             this.loadAllUsers();
           });
         } else {
           throwError('Password too short');
         }
      }
    } else {
      throwError('You are not authorized to perform this action!');
    }
  }

  private loadAllUsers() {
    this.userService.getAll().pipe(first()).subscribe(users => {
      users.sort((x, y) => Number(x.accountActive) - Number(y.accountActive));
      this.users = users;
      this.allUsers = users;
    });
  }

  public loadUsersBySearch() {
    this.users = this.allUsers;
    const search: string = (document.getElementById('myInput') as HTMLInputElement).value;
    if (search.length === 0 || search.length === null) {
      this.users = this.allUsers;
    } else {
      this.users = this.users.filter(
          users => users.username.includes(search) || users.firstName.includes(search) || users.lastName.includes(search));
    }
  }


  public isAdmin(user: User) {
    return user.role === '1';
  }

  public userRole(role) {
    if (role === '1') {
      return 'admin';
    } else if (role === '2') {
      return 'manager';
    } else {
      return 'User';
    }
  }

  public resetInput() {
    this.loadAllUsers();
  }

  public sortByFirstName() {
    if (this.sortTracker === 0) {
      this.users.sort((x, y) => {
        if (x.firstName < y.firstName) {
          return -1;
        }
        if (x.firstName > y.firstName) {
          return 1;
        }
        return 0;
      });
      this.sortTracker = 1;
    } else {
      this.users.sort((x, y) => {
        if (x.firstName > y.firstName) {
          return -1;
        }
        if (x.firstName < y.firstName) {
          return 1;
        }
        return 0;
      });
      this.sortTracker = 0;
    }
  }

  public sortByLastName() {
    if (this.sortTracker === 0) {
      this.users.sort((x, y) => {
        if (x.lastName < y.lastName) {
          return -1;
        }
        if (x.lastName > y.lastName) {
          return 1;
        }
        return 0;
      });
      this.sortTracker = 1;
    } else {
      this.users.sort((x, y) => {
        if (x.lastName > y.lastName) {
          return -1;
        }
        if (x.lastName < y.lastName) {
          return 1;
        }
        return 0;
      });
      this.sortTracker = 0;
    }
  }
  public sortByUsername() {
    if (this.sortTracker === 0) {
      this.users.sort((x, y) => {
        if (x.username < y.username) {
          return -1;
        }
        if (x.username > y.username) {
          return 1;
        }
        return 0;
      });
      this.sortTracker = 1;
    } else {
      this.users.sort((x, y) => {
        if (x.username > y.username) {
          return -1;
        }
        if (x.username < y.username) {
          return 1;
        }
        return 0;
      });
      this.sortTracker = 0;
    }
  }

  public sortByAccountType() {
    if (this.sortTracker === 0) {
      this.users.sort((x, y) => {
        if (x.role < y.role) { return -1; }
        if (x.role > y.role) { return 1; }
        return 0;
      });
      this.sortTracker = 1;
    } else {
      this.users.sort((x, y) => {
        if (x.role > y.role) { return -1; }
        if (x.role < y.role) { return 1; }
        return 0;
      });
      this.sortTracker = 0;
    }
  }
  public sortByAccountDeactivate() {
    if (this.sortTracker === 0) {
      this.users.sort((x, y) => Number(x.accountActive) - Number(y.accountActive));
      this.sortTracker = 1;
    } else {
      this.users.sort((x, y) => Number(y.accountActive) - Number(x.accountActive));
      this.sortTracker = 0;
    }
  }

  changeValue(userId: User, property: string, event: any) {
    this.serviceCallUpdateBasedOnAttribute(property, event, userId);

  }

  public serviceCallUpdateBasedOnAttribute(typeOfChange: string, event: any, userId: User) {
    this.editField = event.target.textContent;
    const updatedUser = new User();
    updatedUser.id = userId.id;

    switch (typeOfChange) {
      case 'fName': {
        const newLog = new LogTrack();
        newLog.logDataInput = 'Changed the first name of user: ' + userId.username + ' to ' + this.editField;
        newLog.logInitial =  userId.username + ' first Name: ' + userId.firstName;
        newLog.logFinal =  userId.username + ' first Name: ' + this.editField;

        updatedUser.firstName = this.editField;
        this.userService.update(updatedUser, this.currentUser, newLog).pipe(first()).subscribe(() => {
          this.loadAllUsers();
        });
        break;
      }
      case 'lName': {

        const newLog = new LogTrack();
        newLog.logDataInput = 'Changed the last name of user: ' + userId.username + ' to ' + this.editField;
        newLog.logInitial =  userId.username + ' last Name: ' + userId.lastName;
        newLog.logFinal =  userId.username + ' last Name: ' + this.editField;

        updatedUser.lastName = this.editField;
        this.userService.update(updatedUser, this.currentUser, newLog).pipe(first()).subscribe(() => {
          this.loadAllUsers();
        });
        break;
      }
      default: {
        break;
      }
    }
  }
}
