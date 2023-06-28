import { DEFAULT_CATEGORY } from "@hw-agconnect/api-ohos";
import { AGConnectUser, AGConnectAuthCredential, SignInResult, TokenResult, AGConnectUserExtra
} from "../../../../types";;

import { AGConnectAuthCredentialProvider } from "../../../../index";
import { StoredUserInfo } from "../storage/StoredUserInfo";
import { AuthBackend } from "../server/AuthBackend";
import { TokenImpl } from "../entity/TokenImpl";
import { AGCAuthError } from "../exception/AGCAuthError";
import { AGCAuthErrorCode } from "../exception/AGCAuthErrorCode";
import { UserLinkRequest } from "../server/request/UserLinkRequest";
import { AccountCredential } from "../provider/AccountCredential";
import { UserLinkResponse } from "../server/response/UserLinkResponse";
import { Constant } from '../utils/Constant';
import { SignInResultImpl } from "../entity/SignInResultImpl";
import { UserUnlinkRequest } from "../server/request/UserUnlinkRequest";
import { UserUnlinkResponse } from "../server/response/UserUnlinkResponse";
import { UpdateEmailRequest } from "../server/request/UpdateEmailRequest";
import { UpdateEmailResponse } from "../server/response/UpdateEmailResponse";
import { UpdatePhoneRequest } from "../server/request/UpdatePhoneRequest";
import { UpdatePhoneResponse } from "../server/response/UpdatePhoneResponse";
import { PhoneUtil } from "../utils/PhoneUtil";
import { UpdatePasswordRequest } from "../server/request/UpdatePasswordRequest";
import { UpdatePasswordResponse } from "../server/response/UpdatePasswordResponse";
import { UserExtraRequest } from "../server/request/UserExtraRequest";
import { UserExtraResponse } from "../server/response/UserExtraResponse";
import { StoredUserManager } from "../storage/StoredUserManager";
import { Logger } from "@hw-agconnect/base-ohos";
import { ReauthenticateRequest } from "../server/request/ReauthenticateRequest";
import { RefreshTokenResponse } from "../server/response/RefreshTokenResponse";
import { ReauthenticateResponse } from "../server/response/ReauthenticateResponse";

const TAG: string = "AGConnectDefaultUser";

export class AGConnectDefaultUser implements AGConnectUser {
  private name: string;
  private authBackend: AuthBackend;
  private user: StoredUserInfo;

  constructor(name: string) {
    if (!name) {
      this.name = DEFAULT_CATEGORY;
    } else {
      this.name = name;
    }
    this.authBackend = new AuthBackend(this.name);
    this.user = new StoredUserInfo(this.name);
  }

  buildUser(response: any): void {
    this.user.anonymous = false;
    this.user.uid = response.getUserInfo().getUid();
    this.user.displayName = response.getUserInfo().getDisplayName();
    this.user.photoUrl = response.getUserInfo().getPhotoUrl();
    this.user.email = response.getUserInfo().getEmail();
    this.user.emailVerified = response.getUserInfo().getEmailVerified();
    this.user.passwordSetted = response.getUserInfo().getPasswordSetted();
    this.user.phone = response.getUserInfo().getPhone();
    this.user.providerId = response.getUserInfo().getProvider().toString();
    this.user.tokenService.constructeSecureTokenService(response.getAccessToken(), response.getRefreshToken());
    this.user.providerService.setProviderInfo(response.getProviders());
  }

  getUser(): StoredUserInfo {
    return this.user;
  }

  getEmailVerified(): boolean {
    return this.user.emailVerified == 1;
  }

  getPasswordSetted(): boolean {
    return this.user.passwordSetted == 1;
  }

  getUid(): string {
    return this.user.uid;
  }

  getEmail(): String {
    return this.user.email;
  }

  getPhone(): String {
    return this.user.phone;
  }

  getDisplayName(): String {
    return this.user.displayName;
  }

  getPhotoUrl(): String {
    return this.user.photoUrl;
  }

  getProviderId(): String {
    return this.user.providerId;
  }

  getProviderInfo(): Map<String, String>[] {
    let res = new Array<Map<string, string>>();
    for (let i = 0; i < this.user.providerService.getProviderInfo().length; i++) {
      let infoMap = new Map<string, string>();
      let allkey = Object.keys(this.user.providerService.getProviderInfo()[i]);
      for (let j = 0; allkey && j < allkey.length; j++) {
        infoMap.set(allkey[j], this.user.providerService.getProviderInfo()[i][allkey[j]])
      }
      res.push(infoMap);
    }
    return res;
  }

  getAccessToken(): string {
    return this.user.tokenService.getAccessToken();
  }

  getRefreshToken(): string {
    return this.user.tokenService.getRefreshToken();
  }

  async getToken(forceRefresh: boolean): Promise<TokenResult> {
    return new Promise((resolve, reject) => {
      this.user.tokenService.fetchAccessToken(forceRefresh).then(token => {
        return resolve(new TokenImpl(token.expiration, token.tokenString));
      }).catch(error => {
        reject(error);
      });
    })
  }

  async getUserExtra(): Promise<AGConnectUserExtra> {
    let userExtraRequest: UserExtraRequest = new UserExtraRequest(this.name);
    let token = await this.getToken(false);
    userExtraRequest.accessToken = token.getString();
    let userExtraResponse = <UserExtraResponse>await this.authBackend.get(userExtraRequest, new UserExtraResponse());
    this.user.displayName = userExtraResponse.displayName;
    this.user.photoUrl = userExtraResponse.photoUrl;
    this.user.emailVerified = userExtraResponse.emailVerified;
    this.user.passwordSetted = userExtraResponse.passwordSetted;
    this.user.email = userExtraResponse.email;
    this.user.phone = userExtraResponse.phone;
    this.user.displayName = userExtraResponse.displayName;
    await StoredUserManager.getInstance(this.name).updateStoredUser(this);
    return Promise.resolve(userExtraResponse.userExtra);
  }

  isAnonymous(): boolean {
    return this.user.anonymous;
  }

  async userReauthenticate(credential: AGConnectAuthCredential): Promise<SignInResult> {
    if (!credential) {
      return Promise.reject(new AGCAuthError(AGCAuthErrorCode.FAIL_TO_DO_USER_REAUTH));
    }
    let reauthenticateRequest = new ReauthenticateRequest(this.name);
    let provider = credential.getProvider();
    if (provider == AGConnectAuthCredentialProvider.Email_Provider ||
      provider == AGConnectAuthCredentialProvider.Phone_Provider) {
      (credential as AccountCredential).prepareUserReauthRequest(reauthenticateRequest);
    }
    let token = await this.getToken(false);
    reauthenticateRequest.accessToken = token.getString();
    let response = <ReauthenticateResponse>await this.authBackend.post(reauthenticateRequest, new ReauthenticateResponse());
    this.buildUser(response);
    await StoredUserManager.getInstance(this.name).updateStoredUser(this);
    return Promise.resolve(new SignInResultImpl(this));
  }

  async link(credential: AGConnectAuthCredential): Promise<SignInResult> {
    if (!credential) {
      return Promise.reject(new AGCAuthError(AGCAuthErrorCode.USER_LINK_FAILED));
    }
    let userLinkRequest: UserLinkRequest = new UserLinkRequest(this.name);
    let provider = credential.getProvider();
    if (provider == AGConnectAuthCredentialProvider.Email_Provider ||
      provider == AGConnectAuthCredentialProvider.Phone_Provider) {
      Logger.info(TAG, "credential is AccountCredential");
      (credential as AccountCredential).prepareUserLinkRequest(userLinkRequest);
    }

    let self = this;
    let token = await this.getToken(false);
    userLinkRequest.accessToken = token.getString();
    let userLinkResponse = <UserLinkResponse>await this.authBackend.post(userLinkRequest, new UserLinkResponse());
    let userInfo = userLinkResponse.getProviderUserInfo();
    if (userInfo) {
      let map: { [key: string]: string } = {};
      self.userInfoToMap(userInfo, map);
      if (self.user.anonymous) {
        self.updateAnonymousUserInfo(map);
      }
      self.user.providerService.updateProvider(map);
      if (map[Constant.Key.MapProviderKey]) {
        let providerStr: string = map[Constant.Key.MapProviderKey]!;
        if (AGConnectAuthCredentialProvider.Email_Provider.toString() == providerStr) {
          let linkEmail = map[Constant.Key.MapEmailKey];
          if (linkEmail) {
            self.user.email = linkEmail;
            self.user.emailVerified = 1;
          }
        } else if (AGConnectAuthCredentialProvider.Phone_Provider.toString() == providerStr) {
          let linkPhone = map[Constant.Key.MapPhoneKey];
          if (linkPhone) {
            self.user.phone = linkPhone;
          }
        }
        if (provider == AGConnectAuthCredentialProvider.Email_Provider || provider == AGConnectAuthCredentialProvider.Phone_Provider) {
          let cre = (credential as AccountCredential);
          if (cre.password != undefined && cre.password != null && cre.password != '') {
            self.user.passwordSetted = 1;
          }
        }
      }
    }
    await StoredUserManager.getInstance(this.name).updateStoredUser(self);
    return Promise.resolve(new SignInResultImpl(this));
  }

  async unlink(credentialProvider: number): Promise<SignInResult> {
    if (!credentialProvider) {
      return Promise.reject(new AGCAuthError(AGCAuthErrorCode.USER_UNLINK_FAILED));
    }
    let userUnLinkRequest = new UserUnlinkRequest(this.name);
    userUnLinkRequest.setProvider(credentialProvider);
    let token = await this.getToken(false);
    userUnLinkRequest.accessToken = token.getString();
    await this.authBackend.post(userUnLinkRequest, new UserUnlinkResponse());
    this.user.providerService.deleteProvider(credentialProvider.toString());
    if (credentialProvider == AGConnectAuthCredentialProvider.Email_Provider) {
      this.user.email = '';
      this.user.emailVerified = 0;
    }
    if (credentialProvider == AGConnectAuthCredentialProvider.Phone_Provider) {
      this.user.phone = '';
    }

    if (this.user.providerService.findProviderIndex((AGConnectAuthCredentialProvider.Email_Provider).toString()) == undefined
      && this.user.providerService.findProviderIndex((AGConnectAuthCredentialProvider.Phone_Provider).toString()) == undefined) {
      this.user.passwordSetted = 0;
    }
    await StoredUserManager.getInstance(this.name).updateStoredUser(this);
    return Promise.resolve(new SignInResultImpl(this));
  }

  async updateEmail(newEmail: string, newVerifyCode: string, lang: string): Promise<void> {
    if (!newEmail || !newVerifyCode) {
      return Promise.reject(new AGCAuthError(AGCAuthErrorCode.FAIL_TO_UPDATE_EMAIL));
    }
    let updateEmailRequest: UpdateEmailRequest = new UpdateEmailRequest(this.name);
    updateEmailRequest.setNewEmail(newEmail);
    updateEmailRequest.setNewVerifyCode(newVerifyCode);
    updateEmailRequest.setLang(lang);
    let token = await this.getToken(false);
    updateEmailRequest.accessToken = token.getString();
    await this.authBackend.put(updateEmailRequest, new UpdateEmailResponse());
    this.user.email = newEmail;
    this.user.providerService.updateEmail(newEmail);
    await StoredUserManager.getInstance(this.name).updateStoredUser(this);
    return Promise.resolve();
  }

  async updatePhone(countryCode: string, newPhone: string, newVerifyCode: string, lang: string): Promise<void> {
    let updatePhoneReq: UpdatePhoneRequest = new UpdatePhoneRequest(this.name);
    updatePhoneReq.countryCode = countryCode;
    updatePhoneReq.newPhone = newPhone;
    updatePhoneReq.newVerifyCode = newVerifyCode;
    updatePhoneReq.lang = lang;
    let token = await this.getToken(false);
    updatePhoneReq.accessToken = token.getString();
    await this.authBackend.put(updatePhoneReq, new UpdatePhoneResponse());
    let combinatePhone = PhoneUtil.combinatePhone(countryCode, newPhone)
    this.user.phone = combinatePhone;
    this.user.providerService.updatePhone(combinatePhone);
    await StoredUserManager.getInstance(this.name).updateStoredUser(this);
    return Promise.resolve();
  }

  async updatePassword(newPassword: string, verifyCode: string, provider: number): Promise<void> {
    let updatePasswordReq: UpdatePasswordRequest = new UpdatePasswordRequest(this.name);
    updatePasswordReq.setProvider(provider);
    updatePasswordReq.setNewPassword(newPassword);
    updatePasswordReq.setNewverifyCode(verifyCode);
    let token = await this.getToken(false);
    updatePasswordReq.accessToken = token.getString();
    await this.authBackend.put(updatePasswordReq, new UpdatePasswordResponse());
    // 更新密码成功后,如果passwordSetted为0,则将passwordSetted设置为1
    if (this.user.passwordSetted == 0) {
      this.user.passwordSetted = 1;
    }
    return Promise.resolve();
  }

  private updateAnonymousUserInfo(info: { [key: string]: string }): void {
    this.user.anonymous = false;
    this.user.displayName = info[Constant.Key.MapDisplayNameKey] ? info[Constant.Key.MapDisplayNameKey]! : '';
    this.user.photoUrl = info[Constant.Key.MapPhotoUrlKey] ? info[Constant.Key.MapPhotoUrlKey]! : '';
    this.user.email = info[Constant.Key.MapEmailKey] ? info[Constant.Key.MapEmailKey]! : '';
    this.user.phone = info[Constant.Key.MapPhoneKey] ? info[Constant.Key.MapPhoneKey]! : '';
    this.user.providerId = info[Constant.Key.MapProviderKey] ? info[Constant.Key.MapProviderKey]! : '';
  }

  private userInfoToMap(userInfo: any, map: { [key: string]: string }) {
    if (userInfo.uid) {
      map[Constant.Key.MapUidKey] = userInfo.uid.toString();
    }
    if (userInfo.displayName) {
      map[Constant.Key.MapDisplayNameKey] = userInfo.displayName.toString();
    }
    if (userInfo.photoUrl) {
      map[Constant.Key.MapPhotoUrlKey] = userInfo.photoUrl.toString();
    }
    if (userInfo.email) {
      map[Constant.Key.MapEmailKey] = userInfo.email.toString();
    }
    if (userInfo.phone) {
      map[Constant.Key.MapPhoneKey] = userInfo.phone.toString();
    }
    if (userInfo.provider) {
      map[Constant.Key.MapProviderKey] = userInfo.provider.toString();
    }
    if (userInfo.openId) {
      map[Constant.Key.MapOpenIdKey] = userInfo.openId.toString();
    }
  }

}