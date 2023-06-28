import { CredentialInfo } from "./CredentialInfo";
import { Preferences, AegisAesManager } from "@hw-agconnect/base-ohos";
import agconnect from "@hw-agconnect/api-ohos";

const STORAGE_CREDENTIAL_FILE: string = "ohos_agc_credential_aegis";

export class ClientTokenStorage {
  private identifier: string;
  private key: string = "ohos_agc_credential";

  private credentialInfo: CredentialInfo | null = null;

  constructor(name: string) {
    this.identifier = name;
    this.key = this.key + "_" + this.identifier;
  }

  async getToken(): Promise<CredentialInfo | null> {
    if (this.credentialInfo != null) {
      return Promise.resolve(this.credentialInfo);
    }

    let context = agconnect.instance().getContext();
    let crypto = await AegisAesManager.getInstance().getDefaultAesCrypto();
    let infoString = await Preferences.get(context, STORAGE_CREDENTIAL_FILE, this.key, crypto);
    if (infoString == null || infoString == '') {
      return Promise.resolve(null);
    }
    try {
      let info = JSON.parse(infoString);
      this.credentialInfo = new CredentialInfo(info.expiration, info.tokenString, info.lastRefreshTime);
      return Promise.resolve(this.credentialInfo);
    } catch (e) {
      // prevent JSON.parse error
      return Promise.resolve(null);
    }
  }

  async putToken(credentialInfo: CredentialInfo): Promise<void> {
    this.credentialInfo = credentialInfo;
    let context = agconnect.instance().getContext();
    let crypto = await AegisAesManager.getInstance().getDefaultAesCrypto();
    await Preferences.put(context, STORAGE_CREDENTIAL_FILE, this.key, JSON.stringify(credentialInfo), crypto);
    return Promise.resolve();
  }

  async removeToken(): Promise<void> {
    this.credentialInfo = null;
    let context = agconnect.instance().getContext();
    await Preferences.delete(context, STORAGE_CREDENTIAL_FILE, this.key);
    return Promise.resolve();
  }

}