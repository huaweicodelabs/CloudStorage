import { BaseRequest } from '@hw-agconnect/credential-ohos'

export class AuthBaseRequest extends BaseRequest {
  protected readonly SERVER_URL: string = "/agc/apigw/oauth2/third/v1";

  constructor(name: string) {
    super(name);
    this.sdkServiceName = "agconnect-auth";
  }

  async queryParam(): Promise<string> {
    let query = "";
    let config = await this.instance.getConfig();
    if (config?.client?.product_id) {
      query = "?productId=" + config?.client?.product_id
    }
    return Promise.resolve(query);
  }

}