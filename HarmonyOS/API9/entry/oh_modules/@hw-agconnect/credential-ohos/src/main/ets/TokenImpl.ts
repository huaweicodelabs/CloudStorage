import { Token } from "../../../types";

export class TokenImpl implements Token {
  expiration: number;
  tokenString: string;

  constructor(expiration: number, tokenString: string) {
    this.expiration = expiration;
    this.tokenString = tokenString;
  }

}