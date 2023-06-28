import { AuthBaseRequest } from "./AuthBaseRequest";

export class UserUnlinkRequest extends AuthBaseRequest {
  private readonly URL: string = this.SERVER_URL + "/user-unlink";
  private provider: number = -1;

  public getProvider(): number {
    return this.provider;
  }

  public setProvider(provider: number): void {
    this.provider = provider;
  }

  async getUrl(): Promise<string> {
    return (await super.getUrl()) + this.URL + await this.queryParam() + "&provider=" + this.provider;
  }

  getBody(): any {
    return {
    }
  }
  
}