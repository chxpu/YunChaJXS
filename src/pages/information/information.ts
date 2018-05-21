import {Component} from '@angular/core';
import {LoadingController, NavController, NavParams,ToastController,} from 'ionic-angular';
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
    stockPrice: "",
    retailPrice: "",
    isSet: false
  };
  // 入库1 出库2
  typeStock: number;
  token: string;

  constructor(public navCtrl: NavController,
              public loadingCtrl: LoadingController,
              public navParams: NavParams,
              public http: HttpClient,
              private userInfo:UserInfoProvider,
              private toastCtrl: ToastController
              ) {
    // 获取扫码的茶饼的信息
    this.ProductInfo= navParams.get('ProductInfo');
    // 获取出库入库操作类型
    this.typeStock = navParams.get('typeStock');
    this.token = userInfo.getUserToken();
    if (this.ProductInfo.stockPrice == "0" ) {
      this.ProductInfo.stockPrice = ''
    }
    if (this.ProductInfo.retailPrice == "0" ) {
      this.ProductInfo.retailPrice = ''
    }
  }

  add(){
    let loading = this.loadingCtrl.create({
      spinner: 'dots',
      content: '入库中'
    });
    loading.present();
    if(this.ProductInfo.stockPrice == "" || this.ProductInfo.retailPrice == ""){
      loading.dismiss();
      this.showToast('价格不能为空',3000,'bottom');
    }
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
          this.showToast(data.msg,3000,'bottom');
          if (data.msg == "入库成功") {
            this.navCtrl.pop();
          }
        },
        error1 => {
          loading.dismiss();
          this.showToast(error1,3000,'bottom');
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
          this.showToast(data.msg,3000,'bottom');
          if (data.outCount != 0) {
            this.navCtrl.pop();
          }
        },
        error1 => {
          loading.dismiss();
          this.showToast(error1,3000,'bottom');
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

  /**
   * 封装showToast
   * @param {string} messageParam,
   * @param {number} durationParam
   * @param {string} positionParam
   */
  showToast(messageParam:string, durationParam:number, positionParam:string) {
    let toast = this.toastCtrl.create({
      message: messageParam,
      duration: durationParam,
      position:positionParam
    });
    toast.present();
  }

}
