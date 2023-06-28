import { AGConnectAuthCredentialProvider } from "../../../../../index";
import { PhoneUtil } from "../../utils/PhoneUtil";
import { AuthBaseRequest } from "./AuthBaseRequest";

export class ResetPhonePasswordRequest extends AuthBaseRequest {
  private URL = this.SERVER_URL + "/reset-password";

  countryCode: string = "";
  phoneNumber: string = "";
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
      account: PhoneUtil.combinatePhone(this.countryCode, this.phoneNumber),
      password: this.newPassword,
      verifyCode: this.verifyCode,
      provider: AGConnectAuthCredentialProvider.Phone_Provider
    }
  }

}