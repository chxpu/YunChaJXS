import {Component} from '@angular/core';
import {Keyboard, LoadingController, NavController, NavParams} from 'ionic-angular';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {UserInfoProvider} from "../../providers/user-info/user-info";
import "rxjs/add/operator/map";

@Component({
  selector: 'page-information',
  templateUrl: 'information.html',
})
export class InformationPage {
  ProductInfo = {
    productName: "",
    qrCode: "",
    productSpecification: "",
    promoteSpecification: "",
    totalCount: "",
    stockPrice: 0,
    retailPrice: 0,
    isSet: false
  };
  // 入库1 出库2
  typeStock: number;
  token: string;

  constructor(public navCtrl: NavController,
              public loadingCtrl: LoadingController,
              public keyboard: Keyboard,
              public navParams: NavParams,
              public http: HttpClient,
              private userInfo:UserInfoProvider) {
    // 获取扫码的茶饼的信息
    this.ProductInfo= navParams.get('ProductInfo');
    // 获取出库入库操作类型
    this.typeStock = navParams.get('typeStock');
    this.token = userInfo.getUserToken();
  }

  add(){
    let loading = this.loadingCtrl.create({
      spinner: 'dots',
      content: '入库中'
    });
    loading.present();
    //上传数据
    let addUrl = 'https://qr.micsoto.com/api/dealer/StockIn?QRCode=';
    addUrl += this.ProductInfo.qrCode;
    addUrl += '&StockPrice=';
    addUrl += this.ProductInfo.stockPrice.toString();
    addUrl += '&RetailPrice=';
    addUrl += this.ProductInfo.retailPrice.toString();
    const addHttpOptions = {
      headers: new HttpHeaders({
        'Authorization': this.token
      }),
    };
    this.http.post<any>(addUrl,null, addHttpOptions)
      .subscribe(data => {
          loading.dismiss();
          // 成功
          this.navCtrl.pop();
          alert('ok:'+data.msg);
        },
        error1 => {
          loading.dismiss();
          alert('error1:'+error1);
        });
  }

  remove() {
    let loading = this.loadingCtrl.create({
      spinner: 'dots',
      content: '出库中'
    });
    loading.present();
    //上传数据
    let removeUrl = 'https://qr.micsoto.com//api/dealer/stockout?qrcode=';
    removeUrl += this.ProductInfo.qrCode;
    // alert(removeUrl + '\n' + this.token);
    const removeHttpOptions = {
      headers: new HttpHeaders({
        'Authorization': this.token
      }),
    };
    this.http.post<any>(removeUrl,null, removeHttpOptions)
      .subscribe(data => {
          loading.dismiss();
          this.navCtrl.pop();
          alert('ok:'+data.msg);
        },
        error1 => {
          loading.dismiss();
          alert('error1:'+ error1);
        });

  }


  ionViewDidLoad() {
    let loading = this.loadingCtrl.create({
      spinner: 'dots',
      content: '请稍候'
    });
    loading.present();
    if(this.typeStock){
      loading.dismiss();
    }
  }

}
