import { Credential, Token } from "../../../types"
import { DEFAULT_CATEGORY } from "@hw-agconnect/api-ohos";
import { ClientTokenRequest } from "./server/ClientTokenRequest";
import { ClientTokenStorage } from "./ClientTokenStorage";
import { CredentialInfo } from "./CredentialInfo";
import { TokenImpl } from "./TokenImpl";
import { Logger } from "@hw-agconnect/base-ohos";
import { AGCError } from "@hw-agconnect/core-ohos";
import { Backend } from "./server/Backend";

const TAG = "AGC_CredentialImpl";

export class CredentialImpl implements Credential {
  private identifier: string;
  private clientTokenStorage: ClientTokenStorage;
  constructor(identifier?: string) {
    this.identifier = identifier ? identifier : DEFAULT_CATEGORY;
    this.clientTokenStorage = new ClientTokenStorage(this.identifier);
  }

  async getToken(forceRefresh?: boolean): Promise<Token> {
    let credentialInfo = await this.clientTokenStorage.getToken();
    if (credentialInfo != null && credentialInfo.isValid()) {
      if ((forceRefresh) && credentialInfo.allowRefresh()) {
        Logger.info(TAG, "force Refresh client token");
      } else {
        Logger.info(TAG, "get client token from local");
        return Promise.resolve(new TokenImpl(credentialInfo.expiration, credentialInfo.tokenString));
      }
    }
    let request = new ClientTokenRequest(this.identifier);
    let response = await Backend.post(request);
    let result = JSON.parse(response);

    // client Token 获取成功时，不存在ret字段
    if (result.ret) {
      Logger.error(TAG, "get client token error");
      return Promise.reject(new AGCError(result.ret.code, result.ret.msg));
    } else {
      Logger.info(TAG, "update client token");
      credentialInfo = new CredentialInfo(result.expires_in, result.access_token, new Date().getTime());
      await this.clientTokenStorage.putToken(credentialInfo);
      return Promise.resolve(new TokenImpl(credentialInfo.expiration, credentialInfo.tokenString));
    }
  }

  async removeToken():Promise<void>{
    let credentialInfo = await this.clientTokenStorage.getToken();
    if (credentialInfo != null) {
      await this.clientTokenStorage.removeToken();
      return Promise.resolve();
    }
  }
}
