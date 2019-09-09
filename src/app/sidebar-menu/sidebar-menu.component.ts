import { Component, OnInit } from '@angular/core';
import { User } from '../_models';
import { UserService } from '../_services';
import {MediaMatcher} from '@angular/cdk/layout';

import {ChangeDetectorRef, OnDestroy} from '@angular/core';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.css']
})
export class SidebarMenuComponent implements OnInit {
  currentUser: User;
  mobileQuery: MediaQueryList;

  constructor(private userService: UserService, changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
  }

  ngOnInit() {
  }
}
