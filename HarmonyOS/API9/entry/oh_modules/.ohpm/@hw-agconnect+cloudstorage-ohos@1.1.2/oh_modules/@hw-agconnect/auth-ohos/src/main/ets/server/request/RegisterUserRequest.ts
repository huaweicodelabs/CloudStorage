import agconnect from "@hw-agconnect/api-ohos";
import { AuthBaseRequest } from "./AuthBaseRequest";

export class RegisterUserRequest extends AuthBaseRequest {
  private readonly URL: string = this.SERVER_URL + "/user-register";
  private useJwt: number = 1;

  email: string | undefined;
  phone: string | undefined;
  password: string | undefined;
  verifyCode: string | undefined;
  provider: number = -1;

  constructor(name: string) {
    super(name);
  }

  async getUrl(): Promise<string> {
    return (await super.getUrl()) + this.URL + await this.queryParam();;
  }

  async getBody(): Promise<any> {
    return {
      email: this.email,
      phone: this.phone,
      password: this.password,
      verifyCode: this.verifyCode,
      useJwt: this.useJwt,
      provider: this.provider,
      aaid: await agconnect.aaid().getAaid()
    };
  }

}