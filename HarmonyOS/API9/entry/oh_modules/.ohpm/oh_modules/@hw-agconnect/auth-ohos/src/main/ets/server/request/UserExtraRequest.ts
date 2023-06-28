import { AuthBaseRequest } from "./AuthBaseRequest";

export class UserExtraRequest extends AuthBaseRequest {
  private readonly URL: string = this.SERVER_URL + "/user-profile";

  constructor(name: string) {
    super(name);
  }

  getBody(): any {
    return {};
  }

  async getUrl(): Promise<string> {
    return (await super.getUrl()) + this.URL + await this.queryParam();;
  }

}