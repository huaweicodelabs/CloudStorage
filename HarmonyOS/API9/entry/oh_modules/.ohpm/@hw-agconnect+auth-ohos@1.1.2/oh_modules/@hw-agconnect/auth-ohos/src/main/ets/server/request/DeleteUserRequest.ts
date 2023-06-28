import { AuthBaseRequest } from "./AuthBaseRequest";

export class DeleteUserRequest extends AuthBaseRequest {
  private URL = this.SERVER_URL + "/user-delete";

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