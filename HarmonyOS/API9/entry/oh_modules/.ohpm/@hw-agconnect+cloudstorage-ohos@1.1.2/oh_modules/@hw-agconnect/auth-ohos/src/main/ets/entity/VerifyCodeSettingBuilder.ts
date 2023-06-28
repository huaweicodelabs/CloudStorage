import { LocaleUtil } from '@hw-agconnect/base-ohos';
import { VerifyCodeSettings } from "../../../../types";

export class VerifyCodeSettingBuilder {
  private action: number = 0;
  private lang: string = '';
  private sendInterval: number = 0;

  setAction(action: number): VerifyCodeSettingBuilder {
    this.action = action;
    return this;
  }

  setLang(lang: string): VerifyCodeSettingBuilder {
    this.lang = lang;
    return this;
  }

  setSendInterval(sendInterval: number): VerifyCodeSettingBuilder {
    this.sendInterval = sendInterval;
    return this;
  }

  getDefaultLang():string {
    return LocaleUtil.getLanguage() + "_" + LocaleUtil.getCountry();
  }

  build(): VerifyCodeSettings {
    return {
      action: this.action,
      lang: this.lang ? this.lang : this.getDefaultLang(),
      sendInterval: this.sendInterval
    }
  }

}