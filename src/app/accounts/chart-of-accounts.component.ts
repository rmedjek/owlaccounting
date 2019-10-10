import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LogTrack, User } from '../_models';
import { ChartOfAccounts } from '../_models/chartOfAccounts';
import { ChartOfAccountsService } from '../_services/chart-of-accounts.service';

@Component({
  selector: 'app-chart-of-accounts',
  templateUrl: './chart-of-accounts.component.html',
  styleUrls: ['./chart-of-accounts.component.css']
})
export class ChartOfAccountsComponent implements OnInit {
  currentUser: User;
  accountList: ChartOfAccounts[] = [];
  editField: string;
  allAccounts: ChartOfAccounts[] = [];
  sortTracker = 0;
  accountBalanceError = false;

  constructor(private accountsService: ChartOfAccountsService,  private router: Router) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.loadAllAccounts();
  }

  private loadAllAccounts() {
    this.accountsService.getAll().pipe(first()).subscribe(account => {
      this.accountList = account;
      this.allAccounts = account;
    });
  }

  public loadUsersBySearch() {
    this.accountList = this.allAccounts;
    const search: string = (document.getElementById('myInput') as HTMLInputElement).value;
    if (search.length === 0 || search.length === null) {
      this.accountList = this.allAccounts;
    } else {
      this.accountList = this.accountList.filter(users => users.accountName.includes(search) || users.accountSubType.includes(search) ||
          users.accountType.includes(search));
    }
  }

  public isAdmin(user: User) {
    return user.role === '1';
  }

  deactivateAccount(account: ChartOfAccounts) {
    if (this.currentUser.role === '1') {
      if (account.accountBalance === 0) {
        account.accountActive = false;

        const newLog = new LogTrack();
        newLog.logDataInput = 'Deactivated account ' + account.accountName;
        newLog.logInitial = account.accountName + ': Active';
        newLog.logFinal = account.accountName + ': Deactive';

        this.accountsService.updateAccount(account, newLog).pipe(first()).subscribe(() => {
          this.loadAllAccounts();
        });
      } else {
        this.accountBalanceError = true;
        setTimeout(() => {
          this.accountBalanceError = false;
        }, 6000);
      }
    }
  }

  activateAccount(account: ChartOfAccounts) {
    if (this.currentUser.role === '1') {
      account.accountActive = true;

      const newLog = new LogTrack();
      newLog.logDataInput = 'Activated account ' + account.accountName;
      newLog.logInitial = account.accountName + ': Deactive';
      newLog.logFinal = account.accountName + ': Active';

      this.accountsService.updateAccount(account, newLog).pipe(first()).subscribe(() => {
        this.loadAllAccounts();
      });
    }
  }

  public resetInput() {
    this.loadAllAccounts();
  }

  public accountActiveStatus(status: boolean) {
    if (status) {
      return 'True';
    } else {
      return 'False';
    }
  }

  changeValue(accountId: ChartOfAccounts, property: string, event: any) {

    const newLog = new LogTrack();
    newLog.logDataInput = 'Changed the ' + property + ' of account number: ' + accountId.accountNumber;
    newLog.logInitial = 'Account number: ' + accountId.accountNumber;

    this.serviceCallUpdateBasedOnAttribute(property, event, accountId, newLog);

  }

  public serviceCallUpdateBasedOnAttribute(typeOfChange: string, event: any, accountNumber: ChartOfAccounts, message: LogTrack) {
    this.editField = event.target.textContent;
    const updatedAccount = new ChartOfAccounts();
    updatedAccount.id = accountNumber.id;

    switch (typeOfChange) {
      case 'name': {
        message.logInitial = message.logInitial + ' name: ' + accountNumber.accountName;
        message.logFinal = 'Account name: ' + this.editField;
        updatedAccount.accountName = this.editField;
        this.accountsService.updateAccount(updatedAccount, message).pipe(first()).subscribe(() => {
          this.loadAllAccounts();
        });
        break;
      }
      case 'term': {
        message.logInitial = message.logInitial + ' term: ' + accountNumber.accountTerm;
        message.logFinal = 'Account term: ' + this.editField;
        updatedAccount.accountTerm = this.editField;
        this.accountsService.updateAccount(updatedAccount, message).pipe(first()).subscribe(() => {
          this.loadAllAccounts();
        });
        break;
      }
      case 'type': {
        message.logInitial = message.logInitial + ' type: ' + accountNumber.accountType;
        message.logFinal = 'Account type: ' + this.editField;
        updatedAccount.accountType = this.editField;
        this.accountsService.updateAccount(updatedAccount, message).pipe(first()).subscribe(() => {
          this.loadAllAccounts();
        });
        break;
      }
      case 'subtype': {
        message.logInitial = message.logInitial + ' sub-type: ' + accountNumber.accountSubType;
        message.logFinal = 'Account sub-type: ' + this.editField;
        updatedAccount.accountSubType = this.editField;
        this.accountsService.updateAccount(updatedAccount, message).pipe(first()).subscribe(() => {
          this.loadAllAccounts();
        });
        break;
      }
      case 'balance': {
        message.logInitial = message.logInitial + ' balance: ' + accountNumber.accountBalance;
        message.logFinal = 'Account balance: ' + this.editField;
        updatedAccount.accountBalance = parseFloat(
            this.editField.replace(',', '.').replace(' ', ''));
        this.accountsService.updateAccount(updatedAccount, message).pipe(first()).subscribe(() => {
          this.loadAllAccounts();
        });
        break;
      }
      default: {
        break;
      }
    }
  }

  public sortByAccountnumber() {
    if (this.sortTracker === 0) {
      this.accountList.sort((x, y) => {
        if (x.accountNumber < y.accountNumber) {
          return -1;
        }
        if (x.accountNumber > y.accountNumber) {
          return 1;
        }
        return 0;
      });
      this.sortTracker = 1;
    } else {
      this.accountList.sort((x, y) => {
        if (x.accountNumber > y.accountNumber) {
          return -1;
        }
        if (x.accountNumber < y.accountNumber) {
          return 1;
        }
        return 0;
      });
      this.sortTracker = 0;
    }
  }

  public sortByAccountName() {
    if (this.sortTracker === 0) {
      this.accountList.sort((x, y) => {
        if (x.accountName < y.accountName) {
          return -1;
        }
        if (x.accountName > y.accountName) {
          return 1;
        }
        return 0;
      });
      this.sortTracker = 1;
    } else {
      this.accountList.sort((x, y) => {
        if (x.accountName > y.accountName) {
          return -1;
        }
        if (x.accountName < y.accountName) {
          return 1;
        }
        return 0;
      });
      this.sortTracker = 0;
    }
  }

  public sortByOrder() {
    if (this.sortTracker === 0) {
      this.accountList.sort((x, y) => {
        if (x.accountOrder < y.accountOrder) {
          return -1;
        }
        if (x.accountOrder > y.accountOrder) {
          return 1;
        }
        return 0;
      });
      this.sortTracker = 1;
    } else {
      this.accountList.sort((x, y) => {
        if (x.accountOrder > y.accountOrder) {
          return -1;
        }
        if (x.accountOrder < y.accountOrder) {
          return 1;
        }
        return 0;
      });
      this.sortTracker = 0;
    }
  }

  public sortByNormalSide() {
    if (this.sortTracker === 0) {
      this.accountList.sort((x, y) => {
        if (x.normalSide < y.normalSide) {
          return -1;
        }
        if (x.normalSide > y.normalSide) {
          return 1;
        }
        return 0;
      });
      this.sortTracker = 1;
    } else {
      this.accountList.sort((x, y) => {
        if (x.normalSide > y.normalSide) {
          return -1;
        }
        if (x.normalSide < y.normalSide) {
          return 1;
        }
        return 0;
      });
      this.sortTracker = 0;
    }
  }

  public sortByAccountSubType() {
    if (this.sortTracker === 0) {
      this.accountList.sort((x, y) => {
        if (x.accountSubType < y.accountSubType) {
          return -1;
        }
        if (x.accountSubType > y.accountSubType) {
          return 1;
        }
        return 0;
      });
      this.sortTracker = 1;
    } else {
      this.accountList.sort((x, y) => {
        if (x.accountSubType > y.accountSubType) {
          return -1;
        }
        if (x.accountSubType < y.accountSubType) {
          return 1;
        }
        return 0;
      });
      this.sortTracker = 0;
    }
  }

  public sortByAccountType() {
    if (this.sortTracker === 0) {
      this.accountList.sort((x, y) => {
        if (x.accountType < y.accountType) {
          return -1;
        }
        if (x.accountType > y.accountType) {
          return 1;
        }
        return 0;
      });
      this.sortTracker = 1;
    } else {
      this.accountList.sort((x, y) => {
        if (x.accountType > y.accountType) {
          return -1;
        }
        if (x.accountType < y.accountType) {
          return 1;
        }
        return 0;
      });
      this.sortTracker = 0;
    }
  }

  public sortByAccountBalance() {
    if (this.sortTracker === 0) {
      this.accountList.sort((x, y) => {
        if (x.accountBalance < y.accountBalance) {
          return -1;
        }
        if (x.accountBalance > y.accountBalance) {
          return 1;
        }
        return 0;
      });
      this.sortTracker = 1;
    } else {
      this.accountList.sort((x, y) => {
        if (x.accountBalance > y.accountBalance) {
          return -1;
        }
        if (x.accountBalance < y.accountBalance) {
          return 1;
        }
        return 0;
      });
      this.sortTracker = 0;
    }
  }

  public sortByInitBalance() {
    if (this.sortTracker === 0) {
      this.accountList.sort((x, y) => {
        if (x.accountInitBalance < y.accountInitBalance) {
          return -1;
        }
        if (x.accountInitBalance > y.accountInitBalance) {
          return 1;
        }
        return 0;
      });
      this.sortTracker = 1;
    } else {
      this.accountList.sort((x, y) => {
        if (x.accountInitBalance > y.accountInitBalance) {
          return -1;
        }
        if (x.accountInitBalance < y.accountInitBalance) {
          return 1;
        }
        return 0;
      });
      this.sortTracker = 0;
    }
  }

  public sortByAccountCreatedBy() {
    if (this.sortTracker === 0) {
      this.accountList.sort((x, y) => {
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
      this.accountList.sort((x, y) => {
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

  public sortByAccountCreatedOn() {
    if (this.sortTracker === 0) {
      this.accountList.sort((x, y) => {
        if (x.createdDate < y.createdDate) {
          return -1;
        }
        if (x.createdDate > y.createdDate) {
          return 1;
        }
        return 0;
      });
      this.sortTracker = 1;
    } else {
      this.accountList.sort((x, y) => {
        if (x.createdDate > y.createdDate) {
          return -1;
        }
        if (x.createdDate < y.createdDate) {
          return 1;
        }
        return 0;
      });
      this.sortTracker = 0;
    }
  }

  public sortByAccountStatus() {
    if (this.sortTracker === 0) {
      this.accountList.sort((x, y) => {
        if (x.accountActive < y.accountActive) {
          return -1;
        }
        if (x.accountActive > y.accountActive) {
          return 1;
        }
        return 0;
      });
      this.sortTracker = 1;
    } else {
      this.accountList.sort((x, y) => {
        if (x.accountActive > y.accountActive) {
          return -1;
        }
        if (x.accountActive < y.accountActive) {
          return 1;
        }
        return 0;
      });
      this.sortTracker = 0;
    }
  }

  setTTableSortEntry(tTableSortAccount: string, accountNumber: number) {
    localStorage.setItem('accountSortBy', JSON.stringify(tTableSortAccount));
    localStorage.setItem('accountNumber', JSON.stringify(accountNumber));
    this.router.navigate(['/ledger']);
  }
}
