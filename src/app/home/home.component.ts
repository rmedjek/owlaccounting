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
  
  //currentRatio dot color booleans
  crGreen = false;
  crYellow = false;
  crRed = false;

  //quickRatio dot color booleans
  qrGreen = false;
  qrYellow = false;
  qrRed = false;

  //AssetTurnover dot color booleans
  atGreen = false;
  atYellow = false;
  atRed = false;

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
    this.addAccountsToList();
   
  }

  private addAccountsToList(){  

    this.accountsService.getAll().pipe(first()).subscribe(account => {
      
      this.accountList = account;
      
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

    if(this.currentRatio > 1.5 && this.currentRatio < 3)
      this.crGreen = true;
    else if(this.currentRatio > 4 || this.currentRatio < 1)
      this.crRed = true;
    else  
      this.crYellow = true;

    return this.currentRatio;
  }

  public calculateQuickRatio(){  //calculates the Quick Ratio which is (currentAssets - Inventory)/currentLiablities
    
    this.getCurrentAssetsAndLiabilities();
    this.getInventory();
    this.quickRatio = (this.totalCurrentAssets - this.totalInventory)/this.totalCurrentLiabilities;

    if(this.quickRatio === 1 || this.quickRatio > 1)
      this.qrGreen = true;
    else if(this.quickRatio < 1 && this.quickRatio > .8)
      this.qrYellow = true;
    else 
      this.qrRed = true;

    return this.quickRatio;
  }

  public calculateTotalAssetsTurnover(){ //calculates Total Assets Turnover which is totalSales/totalCurrentAssets
    
    this.getSales();
    this.getCurrentAssetsAndLiabilities();
    this.assetsTurnover = this.totalSales/this.totalCurrentAssets;

    if(this.assetsTurnover > 1.5)
      this.atGreen = true;
    else if(this.assetsTurnover < 1.5 && this.assetsTurnover > 1)
      this.atYellow = true;
    else
      this.atRed = true;
      
    return this.assetsTurnover;
  }




}
