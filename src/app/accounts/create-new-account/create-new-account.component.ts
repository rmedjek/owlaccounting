import { Component, OnInit } from '@angular/core';
import { User } from '../../_models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../_services';
import { first } from 'rxjs/operators';
import { ChartOfAccountsService } from '../../_services/chart-of-accounts.service';
import { ToasterService } from '../../_services/toast.service';
import { ToasterPosition } from '../../_models/toaster-enum.position';

@Component({
  selector: 'app-create-new-account',
  templateUrl: './create-new-account.component.html',
  styleUrls: ['./create-new-account.component.css']
})
export class CreateNewAccountComponent implements OnInit {
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
    this.createForm();
  }

  private createForm() {
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

  // convenience getter for easy access to form fields
  get f() { return this.accountForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.accountForm.invalid) {
      return;
    }
    this.balance = this.accountForm.controls['accountBalance'].value.toString();
    this.loading = true;
    if (!this.balance.includes('-')) {
      this.chartOfAccountsService.createAccount(this.accountForm.value, this.currentUser)
          .pipe(first())
          .subscribe(
              data => {
                this.toaster.success('Account updated', 'Success', ToasterPosition.bottomRight);
                this.accountForm.reset();
                this.router.navigate(['/accounts']);
              },
              error => {
                this.errorHandler(error, 'Failed to create new accounts');
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
  private errorHandler(error, message) {
    this.toaster.error(message, 'Error', ToasterPosition.bottomRight);
  }
}

