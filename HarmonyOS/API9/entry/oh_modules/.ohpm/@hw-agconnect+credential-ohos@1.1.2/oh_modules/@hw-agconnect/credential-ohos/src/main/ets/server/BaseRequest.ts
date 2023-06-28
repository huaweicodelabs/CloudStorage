import agconnect, { DEFAULT_CATEGORY } from '@hw-agconnect/api-ohos'
import { AGCInstance } from '@hw-agconnect/core-ohos'
import { Logger, SystemUtil } from "@hw-agconnect/base-ohos";

export class BaseRequest {
  identifier: string = DEFAULT_CATEGORY;
  sdkServiceName: string = "";
  sdkVersion: string = "1.0.10";
  sdkPlatform: string = 'OpenHarmony';
  sdkPlatformVersion: string = '';
  sdkType: string = 'JS';
  packageName: string = "";
  appVersion: string = '';
  headerProductId: string = "";
  headerAppId: string = "";
  headerClientId: string = "";
  instance: AGCInstance;
  accessToken: string = "";

  isBackUrl: boolean = false;

  constructor(identifier: string) {
    this.identifier = identifier;
    Logger.info("baseRequest", 'constructor ' + identifier);
    this.instance = agconnect.instance(identifier);
  }

  setSdkServiceName(sdkServiceName: string) {
    this.sdkServiceName = sdkServiceName;
  }

  setSdkVersion(sdkVersion: string) {
    this.sdkVersion = sdkVersion;
  }

  async getHeader(): Promise<any> {
    return {
      sdkVersion: this.sdkVersion,
      sdkPlatform: this.sdkPlatform,
      sdkServiceName: this.sdkServiceName,
      sdkPlatformVersion: this.getSdkPlatformVersion(),
      sdkType: this.sdkType,
      packageName: this.getPackageName(),
      appVersion: await this.getAppVersion(),
      appId: await this.getAppId(),
      client_id: await this.getClientId(),
      productId: await this.getProductId(),
      access_token: this.accessToken,
      "Content-Type": "application/json;charset=UTF-8"
    };
  }

  async getBody(): Promise<any> {

  }
  async getAppId(): Promise<string> {
    let config = await this.instance.getConfig();
    return config.client.app_id;
  }

  async getClientId(): Promise<string> {
    let config = await this.instance.getConfig();
    return config.client.client_id;
  }

  async getClientSecret(): Promise<string> {
    return (this.instance as any).getClientSecret();
  }

  async getApiKey(): Promise<string> {
    return (this.instance as any).getApiKey();
  }

  async getUrl(): Promise<string> {
    return this.isBackUrl ? await (this.instance as any).getGwBackUrl() : await (this.instance as any).getGwUrl();
  }

  async getCpId(): Promise<string> {
    let config = await this.instance.getConfig();
    return config.client.cp_id;
  }

  async getProductId(): Promise<string> {
    let config = await this.instance.getConfig();
    return config.client.product_id;
  }

  getPackageName(): string {
    return SystemUtil.getPackageName(this.instance.getContext());
  }

  getSdkPlatformVersion(): string {
    return SystemUtil.getOsVersion();
  }

  getOsFullName(): string {
    return SystemUtil.getOsFullName();
  }

  async getAppVersion(): Promise<string> {
    return SystemUtil.getAppVersion(this.instance.getContext());
  }

}