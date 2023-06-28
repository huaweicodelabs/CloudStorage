import { AGConnectAuthCredentialProvider } from "../../../../index";
import {Constant} from '../utils/Constant'

/* 
 * ProviderInfoService类实现Provider信息的设置、获取、更新、删除操作
 * 内部数据结构为Map数组
 * Map映射关系为 ProviderInfo: string -> Provider_details: string
 */
export class ProviderInfoService {
  providerInfo: Array<{ [key: string]: string }> = new Array<{ [key: string]: string }>();

  getProviderInfo(): Array<{ [key: string]: string }> {
    return this.providerInfo;
  }

  setProviderInfo(providerInfo: Array<{ [key: string]: string }>): void {
    this.providerInfo = providerInfo;
  }

  updateProvider(info: { [key: string]: string }): void {
    if (info && this.providerInfo) {
      let providerId = info[Constant.Key.MapProviderKey];
      if (providerId) {
        this.deleteProvider(providerId);
      }
      this.providerInfo.push(info);
    }
  }

  updateProviderInfo(provider: number, key: string, value: string): void {
    let index: number | undefined = this.findProviderIndex(provider.toString());
    if (index != undefined) {
      this.providerInfo[index][key] = value;
    }
  }

  updateEmail(newEmail: string): void {
    this.updateProviderInfo(AGConnectAuthCredentialProvider.Email_Provider, Constant.Key.MapEmailKey, newEmail);
  }

  updatePhone(newPhone: string): void {
    this.updateProviderInfo(AGConnectAuthCredentialProvider.Phone_Provider, Constant.Key.MapPhoneKey, newPhone);
  }

  deleteProvider(provider: string): void {
    let index = this.findProviderIndex(provider);
    if (!this.providerInfo || index == undefined) {
      return
    }
    this.providerInfo.splice(index, 1);
  }

  findProviderIndex(provider: string): number | undefined {
    let index: number | undefined = undefined;
    if (provider && this.providerInfo) {
      for (let i = 0; i < this.providerInfo.length; i++) {
        let info = this.providerInfo[i];
        if (info && provider == info[Constant.Key.MapProviderKey]) {
          index = i;
          break;
        }
      }
    }
    return index;
  }
}