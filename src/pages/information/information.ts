import {Component} from '@angular/core';
import { Keyboard, LoadingController, NavController, NavParams} from 'ionic-angular';

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

  constructor(public navCtrl: NavController,
              public loadingCtrl: LoadingController,
              public keyboard: Keyboard,
              public navParams: NavParams ) {
    // 获取扫码的茶饼的信息
    this.ProductInfo= navParams.get('ProductInfo');
    // 获取出库入库操作类型
    this.typeStock = navParams.get('typeStock');
  }

  add(){
    //上传数据

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

    console.log('ionViewDidLoad InformationPage');
  }

}
