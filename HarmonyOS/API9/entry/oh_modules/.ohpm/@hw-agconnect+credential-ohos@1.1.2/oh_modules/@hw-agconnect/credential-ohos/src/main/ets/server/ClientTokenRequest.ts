import { BaseRequest } from "./BaseRequest";

export class ClientTokenRequest extends BaseRequest {
  private REQUEST_URL: string = "/agc/apigw/oauth2/v1/token";
  private useJwt: number = 1;

  constructor(name: string) {
    super(name);
    this.sdkServiceName = "agconnect-credential";
  }

  async getBody(): Promise<any> {
    return {
      grant_type: "client_credentials",
      client_id: await this.getClientId(),
      client_secret: await this.getClientSecret(),
      useJwt: this.useJwt
    };
  }

  async getUrl(): Promise<string> {
    return (await super.getUrl()) + this.REQUEST_URL;
  }

}