import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {ScanPage} from "../scan/scan";
import {StockPage} from "../stock/stock";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {

  }

  addProduct() {
    this.navCtrl.push(ScanPage, {
      typeStock: 1,
    });
  }

  removeProduct() {
    this.navCtrl.push(ScanPage, {
      typeStock: 2,
    });
  }

  showProduct() {
    this.navCtrl.push(StockPage);
  }
}
