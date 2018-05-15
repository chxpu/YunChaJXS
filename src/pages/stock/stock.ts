import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {HttpClient} from "@angular/common/http";
/**
 * Generated class for the StockPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-stock',
  templateUrl: 'stock.html',
})
export class StockPage {
  listDate: Object;
  path: string = "http://jsonplaceholder.typicode.com/photos"
  items: Array<{title: string,sur: number}>;


  constructor(public navCtrl: NavController, public navParams: NavParams,private http: HttpClient) {

    this.items = [];
    for (let i = 1; i < 6; i++) {
      this.items.push({
        title: '滇瑞 ',
        sur:  3131
      });
    }
  }

  ionViewDidLoad() {
    //网络请求
    this.http.post(this.path, null)
      .subscribe(listDate => {
        console.log(listDate)
      })
    console.log('ionViewDidLoad StockPage');
  }

}
