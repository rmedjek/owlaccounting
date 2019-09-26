import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService} from '../../_services';
import { first } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-reset-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  resetForm: FormGroup;
  isResultsLoading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.resetForm = this.formBuilder.group({
      email : ['', Validators.required]
    });
  }

  onSubmit() {
    this.submitted = true;
    this.isResultsLoading = true;

    if (this.resetForm.invalid) {
      return;
    }

    this.userService.forgotPassword(this.resetForm.value)
        .pipe(first())
        .subscribe(data => {
          console.error('forgotPassword subscribe ' + JSON.stringify(data));
          this.snackBar.open(data.message, 'success', {
            duration: 3000
          });
        }, error => {
          this.errorHandler(error, 'Something went wrong');
        }, () => {
          this.isResultsLoading = false;
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

