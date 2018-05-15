import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RemoveProductPage } from './remove-product';

@NgModule({
  declarations: [
    RemoveProductPage,
  ],
  imports: [
    IonicPageModule.forChild(RemoveProductPage),
  ],
})
export class RemoveProductPageModule {}
