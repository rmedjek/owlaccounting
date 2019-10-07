import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { ChartOfAccountsService } from '../../_services/chart-of-accounts.service';
import { ChartOfAccounts } from '../../_models/chartOfAccounts';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-account-view',
  templateUrl: './account-view.component.html',
  styleUrls: ['./account-view.component.css']
})
export class AccountViewComponent implements OnInit {
  account: ChartOfAccounts;
  isResultsLoading = false;

  constructor(private route: ActivatedRoute,
              private chartOfAccountSvc: ChartOfAccountsService,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.route.data.subscribe((data: {account: ChartOfAccounts}) => {
      this.account = data.account;
      console.log(this.account);
    });
  }

  downloadHandler(id) {
    this.isResultsLoading = true;
    this.chartOfAccountSvc.downloadAccount(id).subscribe(
        data => {
          saveAs(data, this.account.accountName);
        },
        err => {
          this.errorHandler(err, 'Error while downloading the account');
        },
        () => {
          this.isResultsLoading = false;
        }
    );
  }

  private errorHandler(error, message) {
    console.error(error);
    this.isResultsLoading = false;
    this.snackBar.open(message, 'Error', {
      duration: 2000
    });
  }
}
