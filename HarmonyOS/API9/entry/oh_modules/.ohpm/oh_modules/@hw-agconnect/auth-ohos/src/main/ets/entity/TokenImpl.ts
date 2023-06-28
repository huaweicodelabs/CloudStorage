import { TokenResult, TokenState } from "../../../../types";
import { Token } from "@hw-agconnect/credential-ohos";

export class TokenImpl implements Token, TokenResult {

  state: TokenState | undefined = undefined;
  expiration: number;
  tokenString: string;

  constructor(expiration: number, tokenString: string) {
    this.expiration = expiration;
    this.tokenString = tokenString;
  }

  getString(): string {
    return this.tokenString;
  }

  getExpirePeriod(): number {
    return this.expiration;
  }

  public getState(): TokenState | undefined {
    return this.state;
  }

  public getToken() {
    return this.tokenString;
  }
}