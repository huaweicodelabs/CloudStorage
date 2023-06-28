import { AGCApi } from '@hw-agconnect/api-ohos';
declare module '@hw-agconnect/api-ohos' {
  interface AGCApi {
    auth(name?: string): AGConnectAuth;
  }
}

declare module './index' {
  interface _ extends AGCApi {}
}

export interface AGConnectAuthCredential {
  /**
   * 获取提当前凭证的供者
   * @return 返回当前凭证的提供者
   */
  getProvider(): number;
}

export interface TokenResult {
  /**
   * 获取用户的Access Token
   *
   * @return AT
   */
  getString(): string;

  /**
   * 获取Token的有效期
   *
   * @return 有效期 单位：秒
   */
  getExpirePeriod(): number;
}

export declare interface SignInResult {
  /**
   * 返回当前登录的用户信息
   * @return 当前登录的用户信息
   */
  getUser(): AGConnectUser;
}

export declare interface AGConnectAuth {
  /**
   * 申请邮箱验证码
   * @param email 邮箱
   * @param settings 申请验证码配置参数
   */
  requestEmailVerifyCode(email: string, settings: VerifyCodeSettings): Promise<VerifyCodeResult>;

  /**
   * 申请短信验证码
   * @param countryCode 国家码
   * @param phoneNumber 手机号
   * @param settings 申请验证码配置参数
   */
  requestPhoneVerifyCode(countryCode: string, phoneNumber: string, settings: VerifyCodeSettings): Promise<VerifyCodeResult>

  /**
   * 邮箱创建账户
   * @return 登录结果异步任务, 在任务成功后通过<code>getUser</code>获取登录的用户信息。
   */
  createEmailUser(emailUser: EmailUser): Promise<SignInResult>

  /**
   * 手机创建账户
   * @return 登录结果异步任务, 在任务成功后通过<code>getUser</code>获取登录的用户信息。
   */
  createPhoneUser(phoneUser: PhoneUser): Promise<SignInResult>

  /**
   * 利用手机重置密码
   *
   * @param countryCode 国家码
   * @param phoneNumber 手机号
   * @param newPassword 新密码
   * @param verifyCode 验证码
   * @return 重置结果异步任务, 在任务成功后通过signIn重新登录。
   */
  resetPasswordByPhone(countryCode: string, phoneNumber: string, newPassword: string, verifyCode: string): Promise<void>

  /**
   * 利用邮箱重置密码
   *
   * @param email 邮箱
   * @param newPassword 新密码
   * @param verifyCode 邮箱获取的验证码
   * @return 重置结果异步任务, 在任务成功后通过signIn重新登录。
   */
  resetPasswordByEmail(email: string, newPassword: string, verifyCode: string): Promise<void>

  /**
   * 登录接口，通过第三方认证来登录AGConnect平台
   *
   * @param credential 第三方OAuth2认证的凭证，需要通过对应的AuthProvider去创建。
   * @return 登录结果异步任务, 在任务成功后通过<code>getUser</code>获取登录的用户信息。
   */
  signIn(credential: AGConnectAuthCredential): Promise<SignInResult>

  /**
   * 在AGConnect服务器侧删除当前用户信息同时清除缓存信息
   */
  deleteUser(): Promise<void>

  /**
   * 登出接口
   * 退出登录状态，删除缓存数据
   */
  signOut(): Promise<void>

  /**
   * 获取当前登录的用户信息，如果未登录则返回null
   *
   * @return 当前用户信息
   */
  getCurrentUser(): Promise<AGConnectUser | null>
}

export interface AGConnectUser {
  /**
   * 用户id，此id由AGConnect生成
   *
   * @return 用户id
   */
  getUid(): string;

  /**
   * 用户Email
   *
   * @return 用户Email
   */
  getEmail(): String;

  /**
   * 用户Phone
   *
   * @return 用户Phone
   */
  getPhone(): String;

  /**
   * 用户名称
   *
   * @return 用户名称
   */
  getDisplayName(): String;

  /**
   * 用户头像
   *
   * @return 头像地址
   */
  getPhotoUrl(): String;

  /**
   * 当前用户的提供者，第三方认证平台的名称
   *
   * @return 用户的提供者
   */
  getProviderId(): String;

  /**
   * 全部第三方平台的用户信息
   *
   * @return 当前登录的各个第三方认证平台用户信息的列表
   */
  getProviderInfo(): Array<Map<String, String>>;

  /**
   * 获取AGC用户的Access Token
   *
   * @param forceRefresh 是否强制刷新
   * @return 用户的Access Token 信息
   */
  getToken(forceRefresh: boolean): Promise<TokenResult>;

  /**
   * 获取当前用户的Extra信息
   *
   * @return 获取结果异步任务
   */
  getUserExtra(): Promise<AGConnectUserExtra>;

  /**
   * 是否是匿名登录用户
   *
   * @return 是否是匿名用户
   */
  isAnonymous(): boolean;

  /**
   * 邮箱验证标记
   *
   * @return 邮箱验证标记
   */
  getEmailVerified(): boolean;

  /**
   * 密码设置标记
   *
   * @return 密码设置标记
   */
  getPasswordSetted(): boolean;

  /**
   * 当前用户关联新的登录方式
   *
   * @param credential 新的第三方登录凭证
   * @return 登录结果异步任务, 在任务成功后通过<code>getUser</code>获取登录的用户信息。
   */
  link(credential: AGConnectAuthCredential): Promise<SignInResult>;

  /**
   * 当前用户解除关联的登录方式
   *
   * @param provider 要解除的登录方式，对应的值参考AGConnectAuthCredential
   * @return 登录结果异步任务, 在任务成功后通过<code>getUser</code>获取登录的用户信息。
   */
  unlink(provider: number): Promise<SignInResult>;

  /**
   * 更新当前用户邮箱
   *
   * @param newEmail 新邮箱地址
   * @param newVerifyCode 验证码
   * @param lang 语言，格式为zh_CN，参考设计文档标准
   * @return 更新结果异步任务
   */
  updateEmail(newEmail: string, newVerifyCode: string, lang: string): Promise<void>;

  /**
   * 更新当前用户手机
   *
   * @param countryCode 国家码
   * @param newPhone 新手机号
   * @param newVerifyCode 验证码
   * @param lang 语言，格式为zh_CN，参考设计文档标准
   * @return 更新结果异步任务
   */
  updatePhone(countryCode: string, newPhone: string, newVerifyCode: string, lang: string): Promise<void>;

  /**
   * 更新当前用户密码
   *
   * @param newPassword 新密码
   * @param verifyCode 验证码，用户登录超过5分钟必填
   * @param provider 手机或邮箱标识,手机为11,邮箱为12
   * @return 更新结果异步任务
   */
  updatePassword(newPassword: string, verifyCode: string, provider: number): Promise<void>;

  /**
   * 用户登陆后重认证
   *
   * @param credential 第三方OAuth2认证的凭证，需要通过对应的AuthProvider去创建。
   * @return 登录结果异步任务, 在任务成功后通过<code>getUser</code>获取登录的用户信息。
   */
  userReauthenticate(credential: AGConnectAuthCredential):Promise<SignInResult>;
}

export interface AGConnectUserExtra {
  /**
   * 创建用户时间
   *
   * @return 创建时间
   */
  getCreateTime(): string;

  /**
   * 最近一次登录时间
   *
   * @return 登录时间
   */
  getLastSignInTime(): string;
}

export type UserProfile = {
  displayName: string;
  photoUrl: string;
}

export interface VerifyCodeResult {

  /**
   * 两次发送验证码的最小时间间隔
   *
   * @return 最小时间间隔，单位：秒
   */
  getShortestInterval(): string;

  /**
   * 验证码有效期
   *
   * @return 有效期，单位：秒
   */
  getValidityPeriod(): string;
}

export interface EmailUser {
  email: string;
  password: string;
  verifyCode: string;
}

export interface PhoneUser {
  countryCode: string;
  phoneNumber: string;
  password: string;
  verifyCode: string;
  getPhone(): string;
}

/**
 * 申请验证码配置参数
 */
export type VerifyCodeSettings = {
  action: number;
  lang: string;
  sendInterval: number;
}

export enum TokenState {
  SIGNED_IN, // 取得AGC授权,调用signIn取得授权
  TOKEN_UPDATED, // AGC Token更新
  TOKEN_INVALID, // AGC Token失效
  SIGNED_OUT // AGC注销
}

export enum VerifyCodeAction {
  REGISTER_LOGIN = 1001,
  RESET_PASSWORD = 1002
}

export enum AGConnectAuthCredentialProvider {
  Phone_Provider = 11,
  Email_Provider = 12
}

export { EmailAuthProvider } from '../src/main/ets/provider/EmailAuthProvider'
export { EmailUserBuilder } from '../src/main/ets/entity/EmailUserBuilder'
export { PhoneAuthProvider } from '../src/main/ets/provider/PhoneAuthProvider'
export { PhoneUserBuilder } from '../src/main/ets/entity/PhoneUserBuilder'
export { VerifyCodeSettingBuilder } from '../src/main/ets/entity/VerifyCodeSettingBuilder'


