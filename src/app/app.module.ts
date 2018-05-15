import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import {LoginPage} from "../pages/login/login";
import {ScanPage} from "../pages/scan/scan";
import {QRScanner} from "@ionic-native/qr-scanner";
import {AddProductPage} from "../pages/add-product/add-product";
import {RemoveProductPage} from "../pages/remove-product/remove-product";
import {InformationPage} from "../pages/information/information";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import { UserInfoProvider } from '../providers/user-info/user-info';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    ScanPage,
    InformationPage,
    AddProductPage,
    RemoveProductPage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    ScanPage,
    InformationPage,
    AddProductPage,
    RemoveProductPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    QRScanner,
    HttpClient,
    UserInfoProvider
  ]
})
export class AppModule {}
