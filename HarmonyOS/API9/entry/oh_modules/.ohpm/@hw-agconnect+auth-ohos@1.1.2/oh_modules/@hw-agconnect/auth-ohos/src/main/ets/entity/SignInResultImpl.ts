import { AGConnectUser, SignInResult } from "../../../../types";

export class SignInResultImpl implements SignInResult {
  private user: AGConnectUser

  constructor(user: AGConnectUser) {
    this.user = user
  }
  /**
   * 返回当前登录的用户信息
   * @return 当前登录的用户信息
   */
  getUser(): AGConnectUser {
    return this.user
  }
}
