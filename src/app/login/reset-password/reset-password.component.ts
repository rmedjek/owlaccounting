import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../_services';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  form: FormGroup;
  isResultsLoading = false;
  private token = '';
  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private snackBar: MatSnackBar,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.initForm();
    this.token = this.route.snapshot.params.token;
  }

  onSubmit() {
    const { password, confirmPassword } = this.form.value;
    if (password !== confirmPassword) {
      this.snackBar.open('Both password should match', 'warning', {
        duration: 3000
      });
      return;
    }
    this.isResultsLoading = true;
    this.userService.resetPassword({ token: this.token, password })
        .subscribe(data => {
              this.snackBar.open('Password updated successfully', 'Success', {
                duration: 3000
              });
              this.router.navigate(['/login']);
            }, err =>  this.errorHandler(err, 'Something went wrong'),
            () =>  this.isResultsLoading = false);
  }

  private initForm() {
    this.form = this.formBuilder.group({
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  private errorHandler(error, message) {
    this.isResultsLoading = false;
    console.error(error);
    this.snackBar.open(message, 'Error', {
      duration: 2000
    });
  }
}
