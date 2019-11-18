import { Component, OnInit } from '@angular/core';

import { User } from '../_models';
import { ChartOfAccounts } from '../_models/chartOfAccounts';
import { ChartOfAccountsService } from '../_services/chart-of-accounts.service';
import { first } from 'rxjs/operators';
import { ChartType, ChartOptions } from 'chart.js';
import { JournalEntry } from '../_models/journal-entries';
import { JournalEntryService } from '../_services/journal-entry.service';
import { SingleDataSet, Label, Colors, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';


@Component({styleUrls: ['home.component.css'],
  templateUrl: 'home.component.html'})

export class HomeComponent implements OnInit {
  currentUser: User;
  totalCurrentAssets = 0;
  totalCurrentLiabilities = 0;
  totalInventory = 0;
  totalSales = 0;
  

  //ratio amounts
  currentRatio = 0;
  quickRatio = 0;
  assetsTurnover = 0;
  accountList: ChartOfAccounts[] = [];
  

  //transactions
  pendingTransactions = 0;
  approvedTransactions = 0;
  deniedTransactions = 0;
  allJournalEntries: JournalEntry[] = [];

  public pieChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false
  };

  public pieChartLabels: Label[] = [['Pending'], ['Approved'], 'Denied'];
  public pieChartData: SingleDataSet = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];
  public pieChartColors: Colors[] = [{backgroundColor: ['#e2da3c', '#20d52f', '#d52020']}]



  constructor(private accountsService: ChartOfAccountsService, private journalEntryService: JournalEntryService) 
  {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }



  ngOnInit() {
    this.addAccountsToList();
    this.loadAllJournalEntries();
   
  }

  private loadAllJournalEntries() {
    this.journalEntryService.getAll().pipe(first()).subscribe(entry => {
      this.allJournalEntries = entry;
      this.allJournalEntries.forEach((item) => {
        if (item.status === 'pending') {
          this.pendingTransactions++;
        }
        else if (item.status === 'approved') {
          this.approvedTransactions++;
        }
        else
          this.deniedTransactions++;
        
      });
      this.pieChartData = [this.pendingTransactions, this.approvedTransactions, this.deniedTransactions]
      
    });
  }

  private addAccountsToList(){  
    this.accountsService.getAll().pipe(first()).subscribe(account => {
      this.accountList = account;
    });
  }

  public setTransactions(){
    this.allJournalEntries.forEach((item) => {
      if (item.status === 'pending') {
        this.pendingTransactions++;
      }
      else if (item.status === 'approved') {
        this.approvedTransactions++;
      }
      else
        this.deniedTransactions++;
      
    });
  }

  public getCurrentAssetsAndLiabilities(){        //retrieves total current assets and liabilities
    this.totalCurrentAssets = 0;
    this.totalCurrentLiabilities = 0;
      this.accountList.forEach((item) => {
        if (item.accountType === 'Asset' && item.accountSubType == 'Current Asset') {
          this.totalCurrentAssets += item.accountBalance;
        }
        else if (item.accountType === 'Liability' && item.accountSubType === 'Current Liability') {
          this.totalCurrentLiabilities += item.accountBalance;
        }
        
      });
  }

  public getSales(){
    this.totalSales = 0;
    this.accountList.forEach((item) => {
      if (item.accountType === 'Revenue') {
        this.totalSales += item.accountBalance;
      }
  });
  return this.totalSales;
  }

  public getInventory(){   //retrieves inventory balance
    this.totalInventory = 0;
    this.accountList.forEach((item) => {
      if (item.accountType === 'Asset' && item.accountSubType === 'Inventory') {
        this.totalInventory += item.accountBalance;
      }
  });
  return this.totalInventory;
}

  ////////////////////////////////////////////////////////functions for calculating ratios////////////////////////////////////////////////////////////////////////////


  public calculateCurrentRatio(){     //calculates the current ratio which is currentAssets/currentLiabilities 
    
    this.getCurrentAssetsAndLiabilities();
    this.currentRatio = (this.totalCurrentAssets/this.totalCurrentLiabilities);

    return this.currentRatio;
  }

  public calculateQuickRatio(){  //calculates the Quick Ratio which is (currentAssets - Inventory)/currentLiablities
    
    this.getCurrentAssetsAndLiabilities();
    this.getInventory();
    this.quickRatio = (this.totalCurrentAssets - this.totalInventory)/this.totalCurrentLiabilities;
    return this.quickRatio;
  }

  public calculateTotalAssetsTurnover(){ //calculates Total Assets Turnover which is totalSales/totalCurrentAssets
    
    this.getSales();
    this.getCurrentAssetsAndLiabilities();
    this.assetsTurnover = this.totalSales/this.totalCurrentAssets;
    return this.assetsTurnover;
  }




}
