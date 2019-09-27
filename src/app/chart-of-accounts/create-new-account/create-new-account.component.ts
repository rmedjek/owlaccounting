import { Component, OnInit } from '@angular/core';
import { User } from '../../_models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService, UserService } from '../../_services';
import { first } from 'rxjs/operators';
import { ChartOfAccountsService } from '../../_services/chart-of-accounts.service';

@Component({
  selector: 'app-create-new-account',
  templateUrl: './create-new-account.component.html',
  styleUrls: ['./create-new-account.component.css']
})
export class CreateNewAccountComponent implements OnInit {

  currentUser: User;
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  balance: string;
  negativeBalanceError = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private chartOfAccountsService: ChartOfAccountsService,
    private alertService: AlertService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      accountNumber: ['', Validators.required],
      accountName: ['', Validators.required],
      accountDesc: [],
      accountType: ['', Validators.required],
      accountSubType: ['', Validators.required],
      normalSide: ['', Validators.required],
      accountBalance: ['', Validators.required],
      accountInitBalance: ['', Validators.required],
      order: ['', Validators.required],
      debit: ['', Validators.required],
      credit: ['', Validators.required],
      statement: ['', Validators.required],
      comment: [''],
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
    this.balance = this.registerForm.controls['accountBalance'].value.toString();
    this.loading = true;
    if (!this.balance.includes('-')) {
      this.chartOfAccountsService.createAccount(this.registerForm.value, this.currentUser)
        .pipe(first())
        .subscribe(
          data => {
            this.alertService.success('Account Created', true);
            this.router.navigate(['/chartOfAccounts']);
          },
          error => {
            this.alertService.error(error);
            this.loading = false;
          });
    } else {
      this.negativeBalanceError = true;
      setTimeout(() => {
        this.negativeBalanceError = false;
      }, 6000);
      return;
    }
  }
}

