import { Component, OnInit } from '@angular/core';
import { User } from '../../_models';
import { UserService } from '../../_services';
import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef } from '@angular/core';
import { BsDropdownConfig } from 'ngx-bootstrap';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.css'],
  providers: [{ provide: BsDropdownConfig, useValue: { isAnimated: true, autoClose: true } }]
})
export class SidebarMenuComponent implements OnInit {
  currentUser: User;
  mobileQuery: MediaQueryList;

  constructor(private userService: UserService, changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
  }

  onHidden(): void {
  }
  onShown(): void {
  }
  isOpenChange(): void {
  }

  ngOnInit() {
  }
}
