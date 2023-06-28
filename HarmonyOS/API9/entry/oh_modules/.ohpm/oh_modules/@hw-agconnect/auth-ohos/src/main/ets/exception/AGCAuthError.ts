import { AGCError } from "@hw-agconnect/core-ohos";
import { AuthErrorCode } from "./AGCAuthErrorCode";

export class AGCAuthError extends AGCError {
  constructor(error: AuthErrorCode) {
    super(error.code, error.message);
    (this as any).__proto__ = AGCAuthError.prototype;
  }

}