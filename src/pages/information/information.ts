import {Component} from '@angular/core';
import {Keyboard, LoadingController, NavController, NavParams} from 'ionic-angular';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {UserInfoProvider} from "../../providers/user-info/user-info";

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
    alert(this.token+'\n'+this.ProductInfo.qrCode+'\n'+this.ProductInfo.stockPrice.toString()+'\n'+this.ProductInfo.retailPrice.toString());
    //上传数据
    let addParams = new HttpParams();
    addParams.append('QRCode', this.ProductInfo.qrCode);
    addParams.append('StockPrice', this.ProductInfo.stockPrice.toString());
    addParams.append('RetailPrice', this.ProductInfo.retailPrice.toString());
    const addHttpOptions = {
      headers: new HttpHeaders({
        'Authorization': this.token
      }),
      params: addParams
    };
    this.http.get<any>('https://qr.micsoto.com/api/Dealer/BatchSpecification', addHttpOptions)
      .subscribe(data => {
        alert(data.msg);
        },
        error1 => {
          alert('错误：' + error1)
        }
      );
    //返回主页
    this.navCtrl.pop();
  }
  remove() {
    //上传数据

    //返回主页
    this.navCtrl.pop();
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
