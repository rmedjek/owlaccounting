import { Component, OnInit } from '@angular/core';
import { LogTrack, User } from '../../_models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../_services';
import { ChartOfAccountsService } from '../../_services/chart-of-accounts.service';
import { ChartOfAccounts } from '../../_models/chartOfAccounts';
import { ToasterService } from '../../_services/toast.service';
import { ToasterPosition } from '../../_models/toaster-enum.position';

@Component({
  selector: 'app-create-new-account',
  templateUrl: './update-account.component.html',
  styleUrls: ['./update-account.component.css']
})
export class UpdateAccountComponent implements OnInit {
  private account: ChartOfAccounts;
  currentUser: User;
  accountForm: FormGroup;
  loading = false;
  submitted = false;
  balance: string;
  negativeBalanceError = false;
  title = 'New Account';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private chartOfAccountsService: ChartOfAccountsService,
    private toaster: ToasterService) {
    this.accountForm = formBuilder.group({
      hideRequired: false,
      floatLabel: 'auto'
    });
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.updateForm();
    this.setAccountToForm();
  }

  private updateForm() {
    this.accountForm = this.formBuilder.group({
      accountNumber: ['', Validators.required],
      accountOrder: ['', Validators.required],
      accountName: ['', Validators.required],
      accountDesc: [],
      accountType: ['', Validators.required],
      accountSubType: ['', Validators.required],
      normalSide: ['', Validators.required],
      accountBalance: ['', Validators.required],
      accountInitBalance: ['', Validators.required],
      debit: ['', Validators.required],
      credit: ['', Validators.required],
      statement: ['', Validators.required],
      comment: [''],
    });
  }

  private setAccountToForm() {
    this.route.params
        .subscribe(params => {
          const id = params['id'];
          if (!id) {
            return;
          }
          this.title = 'Edit Account';
          this.route.data.subscribe((data: {account: ChartOfAccounts}) => {
            this.account = data.account;
          });

          this.accountForm.patchValue({
            accountNumber: this.account.accountNumber,
            accountName: this.account.accountName,
            accountDesc: this.account.accountDesc,
            accountType: this.account.accountType,
            accountSubType: this.account.accountSubType,
            normalSide: this.account.normalSide,
            accountBalance: this.account.accountBalance,
            accountInitBalance: this.account.accountInitBalance,
            accountOrder: this.account.accountOrder,
            createdBy: this.account.createdBy,
            createdDate: this.account.createdDate,
            debit: this.account.debit,
            credit: this.account.credit,
            accountActive: this.account.accountActive,
            statement: this.account.accountNumber,
            comment: this.account.comment
          });
        });
  }

  // convenience getter for easy access to form fields
  get f() { return this.accountForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.accountForm.invalid) {
      return;
    }
    this.balance = this.accountForm.controls.accountBalance.value.toString();
    this.loading = true;
    if (!this.balance.includes('-')) {
      if (this.account) {
        const newLog = new LogTrack();
        newLog.logDataInput = 'account updated ' + this.account.accountBalance;
        newLog.logInitial = this.account.accountBalance + '';
        newLog.logFinal = this.accountForm.controls.accountBalance.value.toString();

        newLog.logDataInput = 'account name updated: ' + this.account.accountName;
        newLog.logInitial = this.account.accountName;
        newLog.logFinal = this.accountForm.controls.accountName.value.toString();

        this.chartOfAccountsService.updateAccountById(this.account.id, this.accountForm.value, newLog)
            .subscribe(data => {
              this.toaster.success('Account updated', 'success', ToasterPosition.bottomRight);
              this.router.navigate(['accounts']);
              },
                    err => this.errorHandler(err, 'Failed to update account'));
      }

      this.negativeBalanceError = true;
      setTimeout(() => {
        this.negativeBalanceError = false;
      }, 6000);
      return;
    }
  }
  private errorHandler(error, message) {
    this.toaster.error(message, 'Error', ToasterPosition.bottomRight);
  }
}

