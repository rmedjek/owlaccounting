import { Component, OnInit } from '@angular/core';

@Component({styleUrls: ['home.component.css'],
  templateUrl: 'home.component.html'})
export class HomeComponent implements OnInit {
  chartData: number[] = [];
  showBarGraph = false;

  constructor() {
  }

  ngOnInit() {
  }
}
