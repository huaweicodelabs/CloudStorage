import { DEFAULT_CATEGORY } from "@hw-agconnect/api-ohos";
import { Token } from "@hw-agconnect/credential-ohos";
import { TokenImpl } from "../entity/TokenImpl";
import { TokenInfo } from "../entity/TokenInfo";
import { AGCAuthError } from "../exception/AGCAuthError";
import { AGCAuthErrorCode } from "../exception/AGCAuthErrorCode";
import { AuthBackend } from "../server/AuthBackend";
import { RefreshTokenRequest } from "../server/request/RefreshTokenRequest";
import { RefreshTokenResponse } from "../server/response/RefreshTokenResponse";
import { StoredUserManager } from "../storage/StoredUserManager";

export class SecureTokenService {
  private readonly TIME_EARLY: number = 5 * 60 * 1000;

  accessToken: string = '';

  accessTokenValidPeriod: number = -1;

  refreshToken: string = '';

  validTime: number = -1;

  name: string = DEFAULT_CATEGORY;

  constructeSecureTokenService(accessToken: TokenInfo, refreshToken: TokenInfo) {
    this.accessToken = accessToken.getToken();
    this.accessTokenValidPeriod = accessToken.getValidPeriod();
    this.refreshToken = refreshToken.getToken();
    // Server返回为秒数，kit内转为毫秒数计算
    this.validTime = (new Date()).getTime() + accessToken.getValidPeriod() * 1000;
  }

  getAccessToken(): string {
    return this.accessToken;
  }

  getRefreshToken(): string {
    return this.refreshToken;
  }

  private isValidAccessToken(): boolean {
    return this.accessToken != null && this.remainToRefreshTime() > 0;
  }

  private remainToRefreshTime(): number {
    return this.validTime - (new Date()).getTime() - this.TIME_EARLY;
  }

  async fetchAccessToken(isForceRefresh: boolean): Promise<Token> {
    if (!isForceRefresh && this.isValidAccessToken()) {
      return Promise.resolve(new TokenImpl(this.accessTokenValidPeriod, this.accessToken));
    }

    if (!this.accessToken || !this.refreshToken) {
      return Promise.reject(new AGCAuthError(AGCAuthErrorCode.NULL_TOKEN));
    }
    let refreshTokenRequest = new RefreshTokenRequest(this.name, this.refreshToken);
    let refreshTokenResponse = <RefreshTokenResponse>await new AuthBackend(this.name).post(refreshTokenRequest, new RefreshTokenResponse());
    this.accessToken = refreshTokenResponse.accessToken.getToken();
    this.accessTokenValidPeriod = refreshTokenResponse.accessToken.getValidPeriod();
    this.validTime = (new Date()).getTime() + this.accessTokenValidPeriod * 1000;
    let storedUserInfo = await StoredUserManager.getInstance(this.name).getStoredUser();
    if (storedUserInfo) {
      storedUserInfo.tokenService.accessToken = this.accessToken;
      storedUserInfo.tokenService.accessTokenValidPeriod = this.accessTokenValidPeriod;
      storedUserInfo.tokenService.refreshToken = this.refreshToken;
      storedUserInfo.tokenService.validTime = this.validTime;
      await StoredUserManager.getInstance(this.name).updateUserInfo(storedUserInfo);
    }
    return Promise.resolve(new TokenImpl(this.accessTokenValidPeriod, this.accessToken));
  }
}