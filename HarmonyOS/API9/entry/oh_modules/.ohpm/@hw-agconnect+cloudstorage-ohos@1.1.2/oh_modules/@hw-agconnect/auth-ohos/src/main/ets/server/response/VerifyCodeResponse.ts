import { BaseResponse } from "@hw-agconnect/credential-ohos";

export class VerifyCodeResponse extends BaseResponse {
  shortestInterval: string = '';
  validityPeriod: string = '';
}