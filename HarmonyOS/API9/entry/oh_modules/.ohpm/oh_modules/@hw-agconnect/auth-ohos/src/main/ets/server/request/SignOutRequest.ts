import { AuthBaseRequest } from "./AuthBaseRequest";

export class SignOutRequest extends AuthBaseRequest {
  private URL = this.SERVER_URL + "/user-signout";

  bodyAccessToken: string = "";

  refreshToken: string = "";

  constructor(name: string) {
    super(name);
  }

  async getUrl(): Promise<string> {
    return (await super.getUrl()) + this.URL + await this.queryParam();;
  }

  getBody(): any {
    return {
      refreshToken: this.refreshToken,
      accessToken: this.bodyAccessToken
    }
  }

}