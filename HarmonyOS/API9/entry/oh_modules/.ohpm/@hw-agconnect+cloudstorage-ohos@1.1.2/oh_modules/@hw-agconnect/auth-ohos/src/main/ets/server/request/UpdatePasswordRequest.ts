import { AuthBaseRequest } from "./AuthBaseRequest";

export class UpdatePasswordRequest extends AuthBaseRequest {
  private readonly URL: string = this.SERVER_URL + "/user-password";

  private verifyCode: string = '';

  private newPassword: string = '';

  private provider: number = 0;

  constructor(name: string) {
    super(name);
  }

  public getProvider(): number {
    return this.provider;
  }

  public setProvider(provider: number): void {
    this.provider = provider;
  }

  public setNewPassword(newPassword: string): void {
    this.newPassword = newPassword;
  }

  public setNewverifyCode(verifyCode: string): void {
    this.verifyCode = verifyCode;
  }

  async getUrl(): Promise<string> {
    return (await super.getUrl()) + this.URL + await this.queryParam();;
  }

  getBody(): any {
    return {
      provider: this.provider,
      verifyCode: this.verifyCode,
      newPassword: this.newPassword
    }
  }
}