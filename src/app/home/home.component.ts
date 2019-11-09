import { Component, OnInit } from '@angular/core';

import { User } from '../_models';
import { ChartOfAccounts } from '../_models/chartOfAccounts';
import { ChartOfAccountsService } from '../_services/chart-of-accounts.service';
import { first } from 'rxjs/operators';


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
  

  constructor(private accountsService: ChartOfAccountsService) 
  {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.addAccountsToList(); //adding accounts to a list
    this.getCurrentAssetsAndLiabilities(); //setting assets and liabilities
    this.getInventory();             //setting inventory
    this.getSales();

    this.calculateCurrentRatio();
    this.calculateQuickRatio();
    this.calculateTotalAssetsTurnover();
  }

  private addAccountsToList(){  
    
    this.accountsService.getAll().pipe(first()).subscribe(account => { //is this method not correct?
      this.accountList = account;
    });
  }

  public getCurrentAssetsAndLiabilities(){        //retrieves total current assets and liabilities

    console.log(this.accountList[0].accountType);     //undefined?
    this.accountList.forEach((item) => {
      if (item.accountType === 'Asset' && item.accountSubType != 'Non-current Asset') {
        this.totalCurrentAssets += item.accountBalance;
      }
      else if (item.accountType === 'Liability') {
        this.totalCurrentLiabilities += item.accountBalance;
      }
    });
    return this.totalCurrentAssets && this.totalCurrentLiabilities;
  }

  public getSales(){
    this.accountList.forEach((item) => {
      if (item.accountType === 'Asset' && item.accountSubType === 'Service Revenue') {
        this.totalSales += item.accountBalance;
      }
  });
  return this.totalSales;
  }

  public getInventory(){   //retrieves inventory balance
    this.accountList.forEach((item) => {
      if (item.accountType === 'Asset' && item.accountSubType === 'Inventory') {
        this.totalInventory += item.accountBalance;
      }
  });
  return this.totalInventory;
}




  ////////////////////////////////////////////////////////functions for calculating ratios////////////////////////////////////////////////////////////////////////////


  public calculateCurrentRatio(){     //calculates the current ratio which is currentAssets/currentLiabilities 
    
    console.log(this.totalCurrentAssets);
    console.log(this.totalCurrentLiabilities);
    this.currentRatio = (this.totalCurrentAssets/this.totalCurrentLiabilities);
    return this.currentRatio;
  }

  public calculateQuickRatio(){  //calculates the Quick Ratio which is (currentAssets - Inventory)/currentLiablities
    
    this.quickRatio = (this.totalCurrentAssets - this.totalInventory)/this.totalCurrentLiabilities;
    return this.quickRatio;
  }

  public calculateTotalAssetsTurnover(){
    this.assetsTurnover = this.totalSales/this.totalCurrentAssets;
    return this.assetsTurnover;
  }

  


}
