import { AuthBaseRequest } from "./AuthBaseRequest";

export class RefreshTokenRequest extends AuthBaseRequest {
  private URL = this.SERVER_URL + "/user-auth/refresh-token";

  refreshToken: string;
  useJwt: number = 1;

  constructor(name: string, refreshToken: string) {
    super(name);
    this.refreshToken = refreshToken;
  }

  getBody(): any {
    return {
      refreshToken: this.refreshToken,
      useJwt: this.useJwt
    };
  }

  async getUrl(): Promise<string> {
    return (await super.getUrl()) + this.URL + await this.queryParam();;
  }

}