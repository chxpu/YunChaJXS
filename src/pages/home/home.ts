import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {ScanPage} from "../scan/scan";
import {StockPage} from "../stock/stock";
import {UserInfoProvider} from "../../providers/user-info/user-info";
import {HttpClient, HttpHeaders} from "@angular/common/http";


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private dealerName: string;
  private role: number;

  constructor(public navCtrl: NavController,
              private userInfo:UserInfoProvider,
              public http: HttpClient,) {
    this.getRuleAndName();
  }

  /**
   * 入库
   */
  addProduct() {
    this.navCtrl.push(ScanPage, {
      typeStock: 1,
    });
  }

  /**
   * 出库
   */
  removeProduct() {
    this.navCtrl.push(ScanPage, {
      typeStock: 2,
    });
  }

  /**
   * 查看库存
   */
  showProduct() {
    this.navCtrl.push(StockPage);
  }

  /**
   * 根据token，获取茶厂名称 和 用户角色role，
   * role = 4 经销商
   * role = 5 茶厂
   */
  getRuleAndName() {
    const GetInfoOptions = {
      headers: new HttpHeaders({
        'Authorization': this.userInfo.getUserToken()
      })
    };
    this.http.get<any>('https://qr.micsoto.com/api/info/getinfo', GetInfoOptions)
      .subscribe(data => {
          this.role = data.role;
          this.dealerName = data.dealerName;
        },
        error1 => {
          alert('获取用户信息错误:user-info.ts' + error1)
        }
      );
  }


}
