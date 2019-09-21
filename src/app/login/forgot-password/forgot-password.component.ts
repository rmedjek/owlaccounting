import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {AlertService, UserService} from '../../_services';
import {first} from 'rxjs/operators';

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
    private alertService: AlertService) { }

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

    if (this.resetForm.invalid) {
      return;
    }

    this.userService.forgotPassword(this.resetForm.value)
        .pipe(first())
        .subscribe(data => {
          console.error('Here ' + data);
        }, error => {
          console.log(error);
        });
  }
}

