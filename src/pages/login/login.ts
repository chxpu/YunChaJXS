import { Component } from '@angular/core';
import {AlertController, App, IonicPage, LoadingController} from 'ionic-angular';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {JSEncrypt} from "jsencrypt"
import hex64 from 'hex64'
import {HomePage} from "../home/home";
import {UserInfoProvider} from "../../providers/user-info/user-info";
import { Storage } from '@ionic/storage'


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})

export class LoginPage {
  private username: string = '';
  private password: string = '';
  private cipherText: string = '';
  private eyeShow: boolean;
  private isRemember: boolean;

  constructor(private http: HttpClient,
              private app: App,
              private userInfo:UserInfoProvider,
              private alertCtrl: AlertController,
              private storage: Storage,
              private loadingCtrl: LoadingController) {
    this.storage.get('username').then((val) => {
      this.username = val;
    });
    this.storage.get('password').then((val) => {
      this.password = val;
    });
    this.eyeShow = false;
    this.isRemember = true;
  }

  ionViewDidLoad() {

  }

  /**
   * 封装alert
   * @param {string} titleParam
   * @param {string} subTitleParam
   */
  showAlert(titleParam: string, subTitleParam: string) {
    let alert = this.alertCtrl.create({
      title: titleParam,
      subTitle: subTitleParam,
      buttons: ['OK']
    });
    alert.present();
  }

  logIn() {
    // 登录动画
    let loading = this.loadingCtrl.create({
      spinner: 'dots',
      content: '登录中'
    });
    loading.present();
    if(this.username.length == 0) {
      this.showAlert('提示', '请输入账号！');
    }
    else if(this.password.length == 0) {
      this.showAlert('提示', '请输入密码！');
    }
    else {
      // 公钥加密
      let encrypt = new JSEncrypt();
      encrypt.setPublicKey('-----BEGIN PUBLIC KEY-----\n' +
        'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC0H5LgwKD7mw2ESwICibUPYgjf\n' +
        'd3dZgtH20RUcPFkIKiEv/EcOpkzZGuB3/yf0eDaTu3SuOpTCKp/3gSqxM6YLzr9Q\n' +
        'rKPhW/SuxKPemPSRPOD6ccgpGjeEPhtlEq9Nsv+OVZ5H1ZVp1TfL2SV3+IamVOuP\n' +
        'sNCX+9lxaDlzjz7i2QIDAQAB\n' +
        '-----END PUBLIC KEY-----\n');
      // encrypt编码为base64，需转为Hexadecimal传入后台接口
      let encrypted = encrypt.encrypt(this.password);
      // console.log('加密后数据:', encrypted);
      // console.log('加密后数据（16进制）:' + hex64.toHex(encrypted));
      this.cipherText = hex64.toHex(encrypted);

      //记住账号
      this.storage.set('username',this.username);
      if(this.isRemember) {
        // 记住密码 写入本地
        this.storage.set('password',this.password);
      }
      // 清空本地账户存储
      else {
        this.storage.remove('password');
      }
      // 发送登录请求
      const posturl = 'https://qr.micsoto.com/api/getsecuretoken';
      const httpOptions = {
        headers: new HttpHeaders({
          'content-type': 'application/x-www-form-urlencoded'
        })
      };
      let postBody = new URLSearchParams();
      postBody.set('username', this.username);
      postBody.set('password', this.cipherText);
      postBody.set('grant_type', 'password');
      postBody.set('client_id', '2');
      postBody.set('client_secret', '1');
      this.http.post<any>(posturl,postBody.toString(), httpOptions)
        .subscribe(data => {
            // 更新userToken
            this.userInfo.setUserToken(data.token_type + ' ' + data.access_token);
            loading.dismiss();
            this.app.getRootNav().setRoot(HomePage);
          },
          error1 => {
            loading.dismiss();
            this.showAlert('登录失败', '用户名或密码错误，请重试！');
          }
        );
    }
  }

}
