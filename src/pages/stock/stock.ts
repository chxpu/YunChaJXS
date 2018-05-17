import { Component } from '@angular/core';
import { NavController} from 'ionic-angular';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {UserInfoProvider} from "../../providers/user-info/user-info";


@Component({
  selector: 'page-stock',
  templateUrl: 'stock.html',
})
export class StockPage {
  items = [];
  token: string;

  constructor(public navCtrl: NavController,
              private http: HttpClient,
              private userInfo: UserInfoProvider) {
    this.token = this.userInfo.getUserToken();
    this.getStock();
  }

  ionViewDidLoad() {
  }

  /**
   *  从后台获取茶饼信息
   */
  getStock() {
    //网络请求
    const getProductHttpOptions = {
      headers: new HttpHeaders({
        'Authorization': this.token
      })
    };
    this.http.get<any>('https://qr.micsoto.com/api/Dealer/DealerStock', getProductHttpOptions)
      .subscribe(data => {
          this.items = data.stock;
          alert('数组长度:'+ this.items.length);
        },
        error1 => {
          alert('错误：' + error1)
        }
      );
  }

}
