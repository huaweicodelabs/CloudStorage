import { AuthBaseRequest } from "./AuthBaseRequest";

export class UpdateEmailRequest extends AuthBaseRequest {
  private readonly URL: string = this.SERVER_URL + "/user-phone-email";

  private newEmail: string = '';
  private newVerifyCode: string = '';
  private lang: string = '';

  public setNewVerifyCode(newVerifyCode: string): void {
    this.newVerifyCode = newVerifyCode;
  }

  public setNewEmail(newEmail: string): void {
    this.newEmail = newEmail;
  }

  public setLang(lang: string): void {
    this.lang = lang;
  }

  constructor(name: string) {
    super(name);
  }

  async getUrl(): Promise<string> {
    return (await super.getUrl()) + this.URL + await this.queryParam();;
  }

  getBody(): any {
    return {
      lang: this.lang,
      newEmail: this.newEmail,
      newVerifyCode: this.newVerifyCode
    }
  }
}