import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController, ViewController} from 'ionic-angular';
import {QRScanner, QRScannerStatus} from "@ionic-native/qr-scanner";
import {InformationPage} from "../information/information";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {UserInfoProvider} from "../../providers/user-info/user-info";


@IonicPage()
@Component({
  selector: 'page-scan',
  templateUrl: 'scan.html',
})
export class ScanPage {
  islight: boolean; //判断闪光灯
  isfrontCamera: boolean; //判断摄像头
  // 扫码结果
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
  token: string;
  typeStock: number;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private qrScanner: QRScanner,
              private viewCtrl: ViewController,
              public http: HttpClient,
              private toastCtrl: ToastController,
              private userInfo:UserInfoProvider) {
    //默认为false
    this.islight = false;
    this.isfrontCamera = false;
    // 获取操作类型 入库1 出库2
    this.typeStock = navParams.get('typeStock');
    // 获取Authorization
    this.token = this.userInfo.getUserToken();
  }

  ionViewDidLoad() {
    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          let scanSub = this.qrScanner.scan().subscribe((text: string) => {
            // alert('二维码内容：' + text + '\n是否合格：' + this.checkCode(text));
            if (!this.checkCode(text)) {
              this.presentToast('二维码信息错误，请重新扫码', 4000, 'top');
              this.ionViewDidLoad();
            }
            // 发送get
            const httpGetOptions = {
              headers: new HttpHeaders({
                'Authorization': this.token
              }),
              params: new HttpParams().append('QRCode', text)
            };
            this.http.get<any>('https://qr.micsoto.com/api/Dealer/BatchSpecification', httpGetOptions)
              .subscribe(data => {
                this.ProductInfo.productName = data.specification.productName;
                this.ProductInfo.qrCode = data.specification.qrCode;
                this.ProductInfo.productSpecification = data.specification.productSpecification;
                this.ProductInfo.promoteSpecification = data.specification.promoteSpecification;
                this.ProductInfo.totalCount = data.specification.totalCount;
                this.ProductInfo.stockPrice = data.specification.stockPrice;
                this.ProductInfo.retailPrice = data.specification.retailPrice;
                this.ProductInfo.isSet = data.specification.isSet;

                this.navCtrl.pop();
                this.navCtrl.push(InformationPage, {
                  ProductInfo: this.ProductInfo,
                  typeStock: this.typeStock
                });
              },
                error1 => {
                  alert('错误：' + error1)
                }
              );
            // this.qrScanner.hide(); // hide camera preview
            scanSub.unsubscribe(); // stop scanning
          });
          // show camera preview
          this.qrScanner.show();

        } else if (status.denied) {
          alert('请为此应用开启相机权限！');
        } else {
          // permission was denied, but not permanently. You can ask for permission again at a later time.
        }
      })
      .catch((e: any) => alert('Error is' + e));
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  /**
   * 控制闪光灯
   */
  toggleLight() {
    this.presentToast(this.islight ? '闪光灯已关闭' : '闪光灯已开启', 2500, 'top');
    if (this.islight) {
      this.qrScanner.disableLight();
    } else {
      this.qrScanner.enableLight();
    }
    this.islight = !this.islight;
  }

  /**
   * 前后摄像头互换
   */
  toggleCamera() {
    this.presentToast(this.isfrontCamera ? '切换为后置摄像头' : '切换为前置摄像头', 2500, 'top');
    if (this.isfrontCamera) {
      this.qrScanner.useBackCamera();
    }
    else {
      this.qrScanner.useFrontCamera();
    }
    this.isfrontCamera = !this.isfrontCamera;

  }

  /**
   * 弹出黑色提示消息
   * @param text
   * @param time
   * @param The position of the toast on the screen. Accepted values: "top", "middle", "bottom".
   */
  presentToast(text, time, position) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: time,
      position: position
    });
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
    toast.present();
  }

  /**
   * 解析URL参数
   * @param url
   * @returns {{}}
   */
  parseQueryString(url): any {
    let obj = {};
    let start = url.indexOf("?")+1;
    let str = url.substr(start);
    let arr = str.split("&");
    for(let i = 0 ;i < arr.length;i++){
      let arr2 = arr[i].split("=");
      obj[arr2[0]] = arr2[1];
    }
    return obj;
  }

  /**
   *
   * @param codeText 检查扫码结果 格式是否正确
   * @returns {boolean} 返回true合格
   */
  checkCode(codeText) {
    if (codeText.toString().length != 26) {
      codeText = this.parseQueryString(codeText).cakeCode;
    }
    if (!isNaN(codeText) && codeText.toString().length == 26) {
      return true
    }
    return false;
  }



}

