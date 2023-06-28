import { Logger } from "../log/logger";
import { ICrypto } from "./ICrypto";
import { AegisAesManager } from "../aegis/AegisAesManager";
import { AegisRandom } from "../aegis/AegisRandom";
import { AegisAes } from "../aegis/AegisAes";

export class AesCrypto implements ICrypto {
  private static readonly TV_LENGTH: number = 16;

  private TAG: string = "AesCrypto";

  private aesKey: string = '';

  constructor(aesKey?: string) {
    if (aesKey) {
      this.aesKey = aesKey;
    }
  }

  async encrypt(plain: string): Promise<string> {
    if (plain == undefined || plain == '' || plain == null) {
      Logger.info(this.TAG, "plain is empty:" + plain);
      return Promise.resolve('');
    }
    if (!this.aesKey) {
      this.aesKey = await AegisAesManager.getInstance().createDefaultAesKey();
    }

    // 再次判断是否生成成功
    if (!this.aesKey) {
      return Promise.resolve(plain);
    }

    let iv = await AegisRandom.random(AesCrypto.TV_LENGTH);
    let cipher = await AegisAes.encryptWithIv(this.aesKey, iv, plain);

    //  aegis加密格式： IV:数据 ,但是framework 加密仅仅返回加密串，需要自己构建IV:数据 格式，兼容老版本
    return iv + ':' + cipher;
  }

  async decrypt(cipher: string): Promise<string> {
    if (cipher == undefined || cipher == '' || cipher == null) {
      Logger.info(this.TAG, "cipher is empty:" + cipher);
      return Promise.resolve('');
    }

    // aegis加密格式： IV:数据
    let ivLastIndex = AesCrypto.TV_LENGTH * 2;
    if (cipher.length <= ivLastIndex) {
      return Promise.resolve(cipher);
    }

    if (!this.aesKey) {
      this.aesKey = await AegisAesManager.getInstance().createDefaultAesKey();
    }

    // 再次判断是否生成成功
    if (!this.aesKey) {
      return Promise.resolve(cipher);
    }

    let iv = cipher.substring(0, ivLastIndex);
    let rawCipher = cipher.substring(ivLastIndex + 1);
    return AegisAes.decryptWithIv(this.aesKey, iv, rawCipher);
  }

}