import { AuthBaseRequest } from "./AuthBaseRequest";

export class UserLinkRequest extends AuthBaseRequest {
  private readonly URL: string = this.SERVER_URL + "/user-link";

  private provider: number = -1;
  private token: string = '';
  private extraData: string = '';
  private useJwt: number = 1;

  constructor(name: string) {
    super(name);
  }

  public setUseJwt(useJwt: number): void {
    this.useJwt = useJwt;
  }

  public setProvider(provider: number): void {
    this.provider = provider;
  }

  public setToken(token: string): void {
    this.token = token;
  }

  public getExtraData(): string {
    return this.extraData;
  }

  public setExtraData(extraData: string): void {
    this.extraData = extraData;
  }

  getBody(): any {
    return {
      provider: this.provider,
      token: this.token,
      extraData: this.extraData,
      useJwt: this.useJwt
    }
  }

  async getUrl(): Promise<string> {
    return (await super.getUrl()) + this.URL + await this.queryParam();;
  }
}
