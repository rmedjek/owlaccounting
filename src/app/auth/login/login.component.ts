import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { LogTrack, User } from '../../_models';

import { AlertService, AuthenticationService } from '../../_services';
import { MatSnackBar } from '@angular/material';
import { UserAccountsComponent } from 'src/app/users/user-accounts/user-accounts.component';


@Component({
    templateUrl: 'login.component.html',
    styleUrls: ['./login.component.css']})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: 'returnUrl';

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService,
        public snackBar: MatSnackBar) {}

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });

        // reset login status
        this.authenticationService.logout();

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onSubmit() {
        this.submitted = true;
        
        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }
    
        this.loading = true;
        this.authenticationService.login(this.f.username.value, this.f.password.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.router.navigate([this.returnUrl]);
                }, error => {
                    this.snackBar.open('incorrect password or username', 'failure', {
                       duration: 6000
                    });
                    this.alertService.error(error);
                    this.loading = false;
                    accountSuspend(this.f.username.value);


                });
    }

}

var invalidLoginCount = 1;
var previousUserName;

function accountSuspend(user){
    var userAccount: UserAccountsComponent;
    if(previousUserName == user){
    invalidLoginCount++;
    }
    else{
        invalidLoginCount = 1;
    }
        
    if (invalidLoginCount > 3){
        invalidLoginCount++;
        userAccount.deactivateUser(user, user);
        }
    previousUserName = user;
    console.log(invalidLoginCount + '  ' + user + previousUserName);
}