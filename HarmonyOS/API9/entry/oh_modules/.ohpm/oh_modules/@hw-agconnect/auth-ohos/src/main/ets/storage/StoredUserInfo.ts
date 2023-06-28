import { ProviderInfoService } from "../user/ProviderInfoService";
import { SecureTokenService } from "../user/SecureTokenService";

export class StoredUserInfo {
  anonymous: boolean = false;
  uid: string = '';
  displayName: string = '';
  photoUrl: string = '';
  email: string = '';
  phone: string = '';
  providerId: string = '';
  emailVerified: number = 0;
  passwordSetted: number = 0;
  providerService: ProviderInfoService = new ProviderInfoService();
  tokenService: SecureTokenService = new SecureTokenService();

  constructor(name: string) {
    this.tokenService.name = name;
  }

  constructUser(info: any): void {
    this.anonymous = info.anonymous;
    this.uid = info.uid;
    this.displayName = info.displayName;
    this.photoUrl = info.photoUrl;
    this.email = info.email;
    this.phone = info.phone;
    this.providerId = info.providerId;
    this.emailVerified = info.emailVerified;
    this.passwordSetted = info.passwordSetted;

    this.providerService.setProviderInfo(info.providerService.providerInfo);
    this.tokenService.accessToken = info.tokenService.accessToken;
    this.tokenService.accessTokenValidPeriod = info.tokenService.accessTokenValidPeriod;
    this.tokenService.refreshToken = info.tokenService.refreshToken;
    this.tokenService.validTime = info.tokenService.validTime;
  }
}