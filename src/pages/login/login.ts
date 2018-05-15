import { Component } from '@angular/core';
import {App, IonicPage, NavController, NavParams} from 'ionic-angular';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {JSEncrypt} from "jsencrypt"
import {HomePage} from "../home/home";
import {UserInfoProvider} from "../../providers/user-info/user-info";

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})

export class LoginPage {
  private username: String = '';
  private password: String = '';
  private eyeshow: boolean = false;
  private isRemember: boolean = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public http: HttpClient,
              private app: App,
              private userInfo:UserInfoProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    this.username ='dlz-A';
    this.password = '123456';
    this.eyeshow = false;
    this.isRemember = false;
  }


  logIn() {
    if(this.username.length == 0) {
      alert("请输入账号");
    }
    else if(this.password.length == 0) {
      alert("请输入密码");
    }
    else {
      // const PUBLICKEY = '-----BEGIN PUBLIC KEY-----\n' +
      //         'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC0H5LgwKD7mw2ESwICibUPYgjf\n' +
      //         'd3dZgtH20RUcPFkIKiEv/EcOpkzZGuB3/yf0eDaTu3SuOpTCKp/3gSqxM6YLzr9Q\n' +
      //         'rKPhW/SuxKPemPSRPOD6ccgpGjeEPhtlEq9Nsv+OVZ5H1ZVp1TfL2SV3+IamVOuP\n' +
      //         'sNCX+9lxaDlzjz7i2QIDAQAB\n' +
      //         '-----END PUBLIC KEY-----\n'
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
      console.log('加密后数据:', encrypted);
      console.log('加密后数据（16进制）:');
      // console.log('公钥:', encrypt.getPublicKey());

      if(this.isRemember) {
        // 记住密码
      }

      this.app.getRootNav().setRoot(HomePage);
      const posturl = 'https://qr.micsoto.com/api/getsecuretoken';
      const httpOptions = {
        headers: new HttpHeaders({
          'content-type': 'application/x-www-form-urlencoded'
        })
      };
      let postBody = new URLSearchParams();
      postBody.set('username', 'dlz-A');
      postBody.set('password', '2CAB87BF69A7491EB8D433371EFB47C2189FD17C4300E0B8F579EB4' +
        'D2126111DBC5085C9D35F51FEA739912913BE48858410BE6EDAA95F3A64AEA1FC3CDE31E024EAE' +
        '95958EC96397A7BFB9DBA3DB5397A0DD80DE3A565A74770F81E332F18301B58812853889FCB797' +
        'DD7B61BCFD259F073D26967C1D9A319B5C6C6391D14F9');
      postBody.set('grant_type', 'password');
      postBody.set('client_id', '2');
      postBody.set('client_secret', '1');
      this.http.post<any>(posturl,postBody.toString(), httpOptions)
        .subscribe(data => {
            // 更新userToken
            this.userInfo.setUserToken(data.token_type + ' ' + data.access_token);
            alert(this.userInfo.getUserToken());
          },
          error1 => {
            console.log('错误：' + error1)
          }
        );


    }

  }

}
