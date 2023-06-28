import { AuthBaseRequest } from "./AuthBaseRequest";

export class VerifyCodeRequest extends AuthBaseRequest {
  private readonly URL: string = this.SERVER_URL + "/verify-code";
  private phone: string = '';
  private email: string = '';
  private action: number = -1;
  private lang: string = '';
  private sendInterval: number = -1;

  constructor(name: string) {
    super(name);
  }

  async getUrl(): Promise<string> {
    return (await super.getUrl()) + this.URL + await this.queryParam();;
  }

  public getBody(): any {
    return {
      phone: this.phone,
      email: this.email,
      lang: this.lang,
      action: this.action,
      sendInterval: this.sendInterval
    };
  }

  public setPhone(phone: string): void {
    this.phone = phone;
  }

  public setEmail(email: string): void {
    this.email = email;
  }

  public setAction(action: number): void {
    this.action = action;
  }

  public setLang(lang: string): void {
    this.lang = lang;
  }

  public setSendInterval(sendInterval: number): void {
    this.sendInterval = sendInterval;
  }

}