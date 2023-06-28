import { AuthBaseRequest } from "./AuthBaseRequest";

export class SignInRequest extends AuthBaseRequest {
  private readonly URL: string = this.SERVER_URL + "/user-signin";

  private provider: number = -1;

  private token: string = '';

  private extraData: string = '';

  private autoCreateUser: number = 1;

  private useJwt: number = 1;

  constructor(name: string) {
    super(name);
  }

  public setUseJwt(useJwt: number) {
    this.useJwt = useJwt;
  }

  public getExtraData(): string {
    return this.extraData;
  }

  public setExtraData(extraData: string): void {
    this.extraData = extraData;
  }

  public setAutoCreateUser(autoCreateUser: number): void {
    this.autoCreateUser = autoCreateUser;
  }

  public setProvider(provider: number): void {
    this.provider = provider;
  }

  public setToken(token: string): void {
    this.token = token;
  }

  public getBody(): any {
    return {
      provider: this.provider,
      token: this.token,
      extraData: this.extraData,
      autoCreateUser: this.autoCreateUser,
      useJwt: this.useJwt
    };
  }

  async getUrl(): Promise<string> {
    return (await super.getUrl()) + this.URL + await this.queryParam();;
  }
}