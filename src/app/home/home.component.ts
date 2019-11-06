
import { Component, OnInit } from '@angular/core';

import { User } from '../_models';


@Component({styleUrls: ['home.component.css'],
  templateUrl: 'home.component.html'})
export class HomeComponent implements OnInit {
  currentUser: User;

  constructor() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
  }
}
