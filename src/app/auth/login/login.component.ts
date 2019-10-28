import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { LogTrack, User } from '../../_models';

import { AlertService, AuthenticationService, UserService } from '../../_services';
import { MatSnackBar } from '@angular/material';


@Component({
    templateUrl: 'login.component.html',
    styleUrls: ['./login.component.css']})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: 'returnUrl';
    invalidLoginCount = 0;
    previousUserName = this.f.username.value;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService,
        private userService: UserService,
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


                });
    }
}


