import { Injectable } from '@angular/core';


@Injectable()
export class UserInfoProvider {
  private userToken: string;

  constructor() {
    console.log('Hello UserInfoProvider Provider');
  }

  /**
   * 设置userToken
   * @param {string} UserToken
   */
  setUserToken(UserToken: string) {
    this.userToken = UserToken;
  }

  /**
   * 获取userToken
   * @returns {string}
   */
  getUserToken() {
    return this.userToken;
  }

}
