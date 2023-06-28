import { AGConnectAuthCredentialProvider } from "../../../../../index";
import { AuthBaseRequest } from "./AuthBaseRequest";

export class ResetEmailPasswordRequest extends AuthBaseRequest {
  private URL = this.SERVER_URL + "/reset-password";

  email: string = "";
  newPassword: string = "";
  verifyCode: string = "";

  constructor(name: string) {
    super(name);
  }

  async getUrl(): Promise<string> {
    return (await super.getUrl()) + this.URL + await this.queryParam();;
  }

  getBody(): any {
    return {
      account: this.email,
      password: this.newPassword,
      verifyCode: this.verifyCode,
      provider: AGConnectAuthCredentialProvider.Email_Provider
    }
  }

}