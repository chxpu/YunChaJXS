import { Component } from '@angular/core';
import {AlertController, App, NavController, Platform} from 'ionic-angular';
import {ScanPage} from "../scan/scan";
import {StockPage} from "../stock/stock";
import {UserInfoProvider} from "../../providers/user-info/user-info";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BackButtonService} from "../../providers/back-button/backButton.service";
import {LoginPage} from "../login/login";
import {Storage} from "@ionic/storage";


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private dealerName: string;
  private role: number;

  constructor(public navCtrl: NavController,
              private userInfo:UserInfoProvider,
              public http: HttpClient,
              private backButtonService: BackButtonService,
              private platform: Platform,
              private app: App,
              private storage: Storage,
              public alertCtrl: AlertController) {
    this.platform.ready().then(() => {
      this.backButtonService.registerBackButtonAction(null);
    });
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

  /**
   * 退出登录，返回登录页
   */
  logOut() {
    let confirm = this.alertCtrl.create({
      message: '是否退出登录?',
      buttons: [
        {
          text: '取消',
          handler: () => {}
        },
        {
          text: '确定',
          handler: () => {
            this.app.getRootNav().setRoot(LoginPage);
            this.storage.set('autoComplete', false);
          }
        }
      ],
    });
    confirm.present();
  }
}
