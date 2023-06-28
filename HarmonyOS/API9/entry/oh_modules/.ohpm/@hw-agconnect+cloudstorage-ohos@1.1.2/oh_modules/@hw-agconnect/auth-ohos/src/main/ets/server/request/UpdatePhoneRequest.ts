import { PhoneUtil } from "../../utils/PhoneUtil";
import { AuthBaseRequest } from "./AuthBaseRequest";

export class UpdatePhoneRequest extends AuthBaseRequest {
  private readonly URL: string = this.SERVER_URL + "/user-phone-email";

  countryCode: string = "";
  newPhone: string = "";
  newVerifyCode: string = "";
  lang: string = "";

  constructor(name: string) {
    super(name);
  }

  async getUrl(): Promise<string> {
    return (await super.getUrl()) + this.URL + await this.queryParam();;
  }

  getBody(): any {
    return {
      lang: this.lang,
      newPhone: PhoneUtil.combinatePhone(this.countryCode, this.newPhone),
      newVerifyCode: this.newVerifyCode
    }
  }
}