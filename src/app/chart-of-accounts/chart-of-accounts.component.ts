import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { catchError, first, map, startWith, switchMap } from 'rxjs/operators';

import { ChartOfAccounts } from '../_models/chartOfAccounts';
import { ChartOfAccountsService } from '../_services/chart-of-accounts.service';
import { LogTrack, User } from '../_models';
import { Router } from '@angular/router';
import { MatPaginator, MatSnackBar, MatSort, MatTableDataSource } from '@angular/material';
import { merge, of } from 'rxjs';

@Component({
  selector: 'app-chart-of-accounts',
  templateUrl: './chart-of-accounts.component.html',
  styleUrls: ['./chart-of-accounts.component.css']
})
export class ChartOfAccountsComponent implements OnInit, AfterViewInit, AfterViewChecked {
  currentUser: User;
  editField: string;
  allAccounts: ChartOfAccounts[] = [];
  sortTracker = 0;
  resultsLength = 0;
  accountBalanceError = false;
  isResultsLoading = false;
  displayedColumns = ['accountNumber', 'accountOrder', 'accountName', 'accountDesc', 'accountType', 'accountSubType', 'normalSide',
    'accountBalance', 'accountInitBalance', 'createdBy', 'createdDate', 'debit', 'credit', 'statement',
    'comment', 'activation', 'action'];
  dataSource = new MatTableDataSource<ChartOfAccounts>();

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(private chartOfAccountsService: ChartOfAccountsService,
              private router: Router,
              public snackBar: MatSnackBar,
              private ref: ChangeDetectorRef) {
     this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
      if (!this.isAdmin(this.currentUser)) {
      this.displayedColumns = ['accountNumber', 'accountOrder', 'accountName', 'accountDesc', 'accountType', 'accountSubType', 'normalSide',
        'accountBalance', 'accountInitBalance', 'createdBy', 'createdDate', 'debit', 'credit', 'statement', 'comment'];
    }
  }

  filterText(filterValue: string) {
   // debugger;
    console.log('fvalue ' + filterValue);
    this.isResultsLoading = true;
    filterValue = filterValue.trim();
    this.paginator.pageIndex = 0;
    this.chartOfAccountsService.getAllAccounts({
      page: this.paginator.pageIndex,
      perPage: this.paginator.pageSize,
      sortField: this.sort.active,
      sortDir: this.sort.direction,
      filter: filterValue
    })
        .subscribe(data => {
          this.dataSource.data = data.docs;
          this.resultsLength = data.total;
          this.isResultsLoading = false;
        }, err => this.errorHandler(err, 'Failed to filter accounts'));
  }

  ngAfterViewInit() {
    // Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.paginator.page, this.sort.sortChange).pipe(
        startWith({}),
        switchMap(() => {
          this.isResultsLoading = true;
          return this.chartOfAccountsService.getAllAccounts({
            page: this.paginator.pageIndex,
            perPage: this.paginator.pageSize,
            sortField: this.sort.active,
            sortDir: this.sort.direction,
            filter: ''
          });
        }),
        map(data => {
          this.isResultsLoading = false;
          this.resultsLength = data.total;
          return data.docs;
        }),
        catchError(() => {
          this.isResultsLoading = false;
          this.errorHandler('Failed to fetch accounts', 'Error');
          return of([]);
        })
    )
    .subscribe(data => {
      this.dataSource.data = data;
    });
  }

  ngAfterViewChecked() {
    // Called after every check of the component's view. Applies to components only.
    // Add 'implements AfterViewChecked' to the class.
    this.ref.detectChanges();
  }

  private loadAllAccounts() {
    return this.chartOfAccountsService.getAllAccounts({
      page: this.paginator.pageIndex,
      perPage: this.paginator.pageSize,
      sortField: this.sort.active,
      sortDir: this.sort.direction,
      filter: ''
    })
     .subscribe(data => {
       this.dataSource.data = data.docs;
       this.allAccounts = data.docs;
       this.resultsLength = data.total;
    });
  }

  editBtnHandler(id) {
    this.router.navigate(['accounts', id]);
  }

  private errorHandler(error, message) {
    this.isResultsLoading = false;
    this.snackBar.open(message, 'Error', {
      duration: 2000
    });
  }

  deleteBtnHandler(id) {
    this.chartOfAccountsService.delete(id)
        .pipe(first())
        .subscribe(data => {
          const invId = this.allAccounts.findIndex(account => account._id === id);
          const deleteAccount = this.allAccounts[invId];
          this.allAccounts.splice(invId, 1);
          this.dataSource.data = [...this.dataSource.data];
          this.snackBar.open('Accounts deleted', 'Success', {
            duration: 2000
          });
        }, err => this.errorHandler(err,    'Failed to delete account'));
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

        this.chartOfAccountsService.updateAccount(account, newLog).pipe(first()).subscribe(() => {
          this.loadAllAccounts();
        });
      } else {
        this.accountBalanceError = true;
        this.snackBar.open('account must be zero', 'failure', {duration: 2000});
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

      this.chartOfAccountsService.updateAccount(account, newLog).pipe(first()).subscribe(() => {
        this.loadAllAccounts();
      });
    }
  }
}
