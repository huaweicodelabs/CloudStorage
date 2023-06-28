import {
  AGConnectAuth, AGConnectUser, AGConnectAuthCredential, EmailUser,
  PhoneUser, SignInResult, VerifyCodeResult, VerifyCodeSettings
} from "../../../types";

import { AGConnectAuthCredentialProvider } from "../../../index";

import { DEFAULT_CATEGORY } from "@hw-agconnect/api-ohos";
import { AGCAuthErrorCode } from "./exception/AGCAuthErrorCode";
import { RegisterUserRequest } from "./server/request/RegisterUserRequest";
import { AuthBackend } from "./server/AuthBackend";
import { VerifyCodeRequest } from "./server/request/VerifyCodeRequest";
import { VerifyCodeResponse } from './server/response/VerifyCodeResponse'
import { VerifyCodeResultImpl } from "./entity/VerifyCodeResultIpml";
import { PhoneUtil } from "./utils/PhoneUtil";
import { SignInResponse } from "./server/response/SignInResponse";
import { AGConnectDefaultUser } from "./user/AGConnectDefaultUser";
import { SignInResultImpl } from "./entity/SignInResultImpl";
import { AccountCredential } from "./provider/AccountCredential";
import { SignInRequest } from "./server/request/SignInRequest";
import { Logger } from "@hw-agconnect/base-ohos";
import { AGCAuthError } from "./exception/AGCAuthError";
import { SignOutRequest } from "./server/request/SignOutRequest";
import { DeleteUserRequest } from "./server/request/DeleteUserRequest";
import { DeleteUserResponse } from "./server/response/DeleteUserResponse";
import { ResetEmailPasswordRequest } from "./server/request/ResetEmailPasswordRequest";
import { ResetEmailPasswordResponse } from "./server/response/ResetEmailPasswordResponse";
import { ResetPhonePasswordRequest } from "./server/request/ResetPhonePasswordRequest";
import { StoredUserManager } from "./storage/StoredUserManager";

const TAG: string = "AGConnectAuthImpl";
export class AGConnectAuthImpl implements AGConnectAuth {
  private identifier: string;
  private authBackend: AuthBackend;

  constructor(identifier?: string) {
    if (!identifier) {
      this.identifier = DEFAULT_CATEGORY;
    } else {
      this.identifier = identifier;
    }
    Logger.info(TAG, "constructor name is" + this.identifier);
    this.authBackend = new AuthBackend(this.identifier);
  }

  async requestEmailVerifyCode(email: string, settings: VerifyCodeSettings): Promise<VerifyCodeResult> {
    let request = new VerifyCodeRequest(this.identifier);
    request.setEmail(email);
    request.setAction(settings.action);
    request.setLang(settings.lang);
    request.setSendInterval(settings.sendInterval);
    let verifyCodeResponse = <VerifyCodeResponse>await this.authBackend.post(request, new VerifyCodeResponse());
    return new VerifyCodeResultImpl(verifyCodeResponse.shortestInterval, verifyCodeResponse.validityPeriod);
  }

  async requestPhoneVerifyCode(countryCode: string, phoneNumber: string, settings: VerifyCodeSettings): Promise<VerifyCodeResult> {
    let request = new VerifyCodeRequest(this.identifier);
    request.setPhone(PhoneUtil.combinatePhone(countryCode, phoneNumber));
    request.setAction(settings.action);
    request.setLang(settings.lang);
    request.setSendInterval(settings.sendInterval);
    let verifyCodeResponse = <VerifyCodeResponse>await this.authBackend.post(request, new VerifyCodeResponse());
    return new VerifyCodeResultImpl(verifyCodeResponse.shortestInterval, verifyCodeResponse.validityPeriod);
  }

  async createEmailUser(emailUser: EmailUser): Promise<SignInResult> {
    let request = new RegisterUserRequest(this.identifier);
    request.email = emailUser.email;
    request.password = emailUser.password;
    request.verifyCode = emailUser.verifyCode;
    request.provider = AGConnectAuthCredentialProvider.Email_Provider;
    let signInResponse = <SignInResponse>await this.authBackend.post(request, new SignInResponse());
    let user = new AGConnectDefaultUser(this.identifier);
    user.buildUser(signInResponse);
    await StoredUserManager.getInstance(this.identifier).updateStoredUser(user);
    return new SignInResultImpl(user);
  }

  async createPhoneUser(phoneUser: PhoneUser): Promise<SignInResult> {
    let request = new RegisterUserRequest(this.identifier);
    request.phone = PhoneUtil.combinatePhone(phoneUser.countryCode, phoneUser.phoneNumber)
    request.password = phoneUser.password;
    request.verifyCode = phoneUser.verifyCode;
    request.provider = AGConnectAuthCredentialProvider.Phone_Provider;
    let signInResponse = <SignInResponse>await this.authBackend.post(request, new SignInResponse());
    let user = new AGConnectDefaultUser(this.identifier);
    user.buildUser(signInResponse);
    await StoredUserManager.getInstance(this.identifier).updateStoredUser(user);
    return new SignInResultImpl(user);
  }

  async signIn(credential: AGConnectAuthCredential): Promise<SignInResult> {
    if (!credential) {
      return Promise.reject(new AGCAuthError(AGCAuthErrorCode.CREDENTIAL_INVALID));
    }

    let currentUser = await this.getCurrentUser();
    if (currentUser != null) {
      return Promise.reject(new AGCAuthError(AGCAuthErrorCode.ALREADY_SIGN_IN_USER));
    }
    let request = new SignInRequest(this.identifier);
    let provider = credential.getProvider();
    if (provider == AGConnectAuthCredentialProvider.Email_Provider ||
      provider == AGConnectAuthCredentialProvider.Phone_Provider) {
      Logger.info(TAG, "credential is AccountCredential");
      (credential as AccountCredential).prepareUserAuthRequest(request);
    }
    let signInResponse = <SignInResponse>await this.authBackend.post(request, new SignInResponse());
    let user = new AGConnectDefaultUser(this.identifier);
    user.buildUser(signInResponse);
    await StoredUserManager.getInstance(this.identifier).updateStoredUser(user);
    return new SignInResultImpl(user);
  }

  async signOut(): Promise<void> {
    let user = await this.getCurrentUser();
    if (user) {
      let defaultUser = <AGConnectDefaultUser>user;
      let signOutRequest = new SignOutRequest(this.identifier);
      signOutRequest.bodyAccessToken = defaultUser.getAccessToken();
      signOutRequest.refreshToken = defaultUser.getRefreshToken();

      await StoredUserManager.getInstance(this.identifier).updateStoredUser(null);
      // 不返回signout接口的返回值，
      await this.authBackend.post(signOutRequest, new SignInResponse()).catch(error => {
        Logger.debug(TAG, "signout inner error, " + error);
        return Promise.resolve();
      });
    } else {
      Logger.info(TAG, "no user login in");
    }
    return Promise.resolve();
  }

  async resetPasswordByPhone(countryCode: string, phoneNumber: string, newPassword: string, verifyCode: string): Promise<void> {
    let request: ResetPhonePasswordRequest = new ResetPhonePasswordRequest(this.identifier);
    request.countryCode = countryCode;
    request.phoneNumber = phoneNumber;
    request.newPassword = newPassword;
    request.verifyCode = verifyCode;
    await this.authBackend.post(request, new ResetEmailPasswordResponse());
    return Promise.resolve();
  }

  async resetPasswordByEmail(email: string, newPassword: string, verifyCode: string): Promise<void> {
    let request: ResetEmailPasswordRequest = new ResetEmailPasswordRequest(this.identifier);
    request.email = email;
    request.newPassword = newPassword;
    request.verifyCode = verifyCode;
    await this.authBackend.post(request, new ResetEmailPasswordResponse());
    return Promise.resolve();
  }

  async deleteUser(): Promise<void> {
    let user = await this.getCurrentUser();
    if (user) {
      let defaultUser = <AGConnectDefaultUser>user;
      let deleteUserRequest = new DeleteUserRequest(this.identifier);
      deleteUserRequest.accessToken = defaultUser.getAccessToken();
      await this.authBackend.post(deleteUserRequest, new DeleteUserResponse());
      await StoredUserManager.getInstance(this.identifier).updateStoredUser(null);
    } else {
      return Promise.reject(new AGCAuthError(AGCAuthErrorCode.NOT_SIGN_IN));
    }
    return Promise.resolve();
  }

  async getCurrentUser(): Promise<AGConnectUser | null> {
    let userInfo = await StoredUserManager.getInstance(this.identifier).getStoredUser();
    if (userInfo == null) {
      return Promise.resolve(null);
    }
    let user = new AGConnectDefaultUser(this.identifier);
    user.getUser().constructUser(userInfo);
    return Promise.resolve(user);
  }


}