import { Component } from '@angular/core';
import {AlertController, App, IonicPage, LoadingController, Platform, ToastController} from 'ionic-angular';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {JSEncrypt} from "jsencrypt"
import hex64 from 'hex64'
import {HomePage} from "../home/home";
import {UserInfoProvider} from "../../providers/user-info/user-info";
import { Storage } from '@ionic/storage'
import {BackButtonService} from "../../providers/back-button/backButton.service";
import { ScreenOrientation } from '@ionic-native/screen-orientation';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})

export class LoginPage {
  public username: string = '';
  public password: string = '';
  private cipherText: string = '';
  private eyeShow: boolean;
  public isRemember: boolean;

  constructor(private http: HttpClient,
              private app: App,
              private userInfo:UserInfoProvider,
              private alertCtrl: AlertController,
              private storage: Storage,
              private loadingCtrl: LoadingController,
              private backButtonService: BackButtonService,
              private platform: Platform,
              private screenOrientation: ScreenOrientation,
              private toastCtrl: ToastController) {
    // 注册返回键服务
    this.platform.ready().then(() => {
      this.backButtonService.registerBackButtonAction(null);
    });
    // 获取本地存储的记住用户名密码
    this.storage.get('username').then((val) => {
      if(val != null) {
        this.username = val;
      }
    });
    this.storage.get('password').then((val) => {
      if(val != null) {
        this.password = val;
      }
    });
    this.eyeShow = false;
    this.storage.get('isRemember').then((val) =>
      this.isRemember = val
    );
  }

  ionViewDidLoad() {
    // 紧张屏幕旋转
    this.screenOrientation.lock('portrait');
    // 自动登录
    this.storage.get('autoComplete').then((val) => {
      if(val == true && this.username!="" && this.password!="") {
        this.logIn();
      }
    });
  }

  logIn() {
    // 登录动画
    let loading = this.loadingCtrl.create({
      spinner: 'dots',
      content: '登录中'
    });
    if(this.isRemember) {
      // 记住账号密码 写入本地
      this.storage.set('username',this.username);
      this.storage.set('password',this.password);
      this.storage.set('isRemember', true);
    }
    else {
      // 清空本地账户存储
      this.storage.remove('username');
      this.storage.remove('password');
      this.storage.set('isRemember', false);
    }
    // 判断数据合法性
    if(this.username.length == 0) {
      this.showToast('请输入账号!', 2000, 'bottom','');
    }
    else if(this.password.length == 0) {
      this.showToast('请输入密码!', 2000, 'bottom','');
    }
    else {
      loading.present();
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

      // 发送登录请求
      const postUrl = 'https://qr.micsoto.com/api/getsecuretoken';
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
      this.http.post<any>(postUrl,postBody.toString(), httpOptions)
        .subscribe(data => {
            // 更新userToken
            this.userInfo.setUserToken(data.token_type + ' ' + data.access_token);
            loading.dismiss();
            this.app.getRootNav().setRoot(HomePage);
            this.storage.set('autoComplete', true);
          },
          error1 => {
            loading.dismiss();
            this.showToast('用户名或密码错误，请重试！', 2000,'bottom','');
          }
        );
    }
  }

  /**
   * 封装showToast
   * @param {string} messageParam,
   * @param {number} durationParam
   * @param {string} positionParam
   */
  showToast(messageParam:string, durationParam:number, positionParam:string, cssClassParam:string) {
    let toast = this.toastCtrl.create({
      message: messageParam,
      duration: durationParam,
      position:positionParam,
      cssClass: cssClassParam
    });
    toast.present();
  }
}
