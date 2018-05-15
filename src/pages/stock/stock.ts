import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {HttpClient} from "@angular/common/http";


@Component({
  selector: 'page-stock',
  templateUrl: 'stock.html',
})
export class StockPage {
  items: Array<{title: string,sur: number}>;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private http: HttpClient) {
    this.items = [];
    for (let i = 1; i < 20; i++) {
      this.items.push({
        title: '滇瑞 ',
        sur: 3131
      });
    }
  }

  ionViewDidLoad() {
    //网络请求

  }

}
