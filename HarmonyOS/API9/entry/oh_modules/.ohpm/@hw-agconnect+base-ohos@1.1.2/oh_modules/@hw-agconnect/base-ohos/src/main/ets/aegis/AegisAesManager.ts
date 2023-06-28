import { RX_HEX } from '../crypto/Constant';
import { Preferences } from '../datastore/preference';
import { AegisRandom } from './AegisRandom';
import { AegisAes } from './AegisAes';
import { AesCrypto } from '../crypto/AesCrypto';

/**
 * 提供统一的默认AesCrypto，防止重复迭代消耗性能
 */
export class AegisAesManager {
  private static instance: AegisAesManager = new AegisAesManager();
  private static appContext: any;

  private static readonly FILE_NAME: string = 'AGC_DEFAULT_AES';
  private static readonly KEY_RY_HEX: string = 'RY_HEX';
  private static readonly KEY_RZ_HEX: string = 'RZ_HEX';
  private static readonly KEY_SL_HEX: string = 'sl_HEX';

  private static readonly KEY_LENGTH: number = 32;
  private static readonly SALT_LENGTH: number = 16;
  private static readonly ITERATION_COUNT: number = 1000;

  private aeskey: string = '';
  private crypto: AesCrypto | undefined;

  private constructor() {
  }

  static init(context: any) {
    AegisAesManager.appContext = context;
  }
  public static getInstance(): AegisAesManager {
    return this.instance;
  }

  public async getDefaultAesCrypto(): Promise<AesCrypto> {
    if (!this.crypto) {
      this.crypto = new AesCrypto(await this.createDefaultAesKey());
    }
    return this.crypto;
  }

  public async createDefaultAesKey(): Promise<string> {
    if (!AegisAesManager.appContext) {
      throw new Error('[AegisAesManager] context is null, please Invoke the {agconnect.instance().init(context)} method to initialize the AGC SDK.');
    }
    if (this.aeskey) {
      return this.aeskey;
    }
    let rxHex = RX_HEX;
    let ryHex = await Preferences.get(AegisAesManager.appContext, AegisAesManager.FILE_NAME, AegisAesManager.KEY_RY_HEX);
    let rZHex = await Preferences.get(AegisAesManager.appContext, AegisAesManager.FILE_NAME, AegisAesManager.KEY_RZ_HEX);
    let slHex = await Preferences.get(AegisAesManager.appContext, AegisAesManager.FILE_NAME, AegisAesManager.KEY_SL_HEX);
    if (!this.isValid(ryHex, AegisAesManager.KEY_LENGTH * 2)
      || !this.isValid(rZHex, AegisAesManager.KEY_LENGTH * 2)
      || !this.isValid(slHex, AegisAesManager.SALT_LENGTH * 2)) {
      ryHex = await AegisRandom.random(AegisAesManager.KEY_LENGTH);
      rZHex = await AegisRandom.random(AegisAesManager.KEY_LENGTH);
      slHex = await AegisRandom.random(AegisAesManager.SALT_LENGTH);
      await Preferences.put(AegisAesManager.appContext, AegisAesManager.FILE_NAME, AegisAesManager.KEY_RY_HEX, ryHex);
      await Preferences.put(AegisAesManager.appContext, AegisAesManager.FILE_NAME, AegisAesManager.KEY_RZ_HEX, rZHex);
      await Preferences.put(AegisAesManager.appContext, AegisAesManager.FILE_NAME, AegisAesManager.KEY_SL_HEX, slHex);
    }
    this.aeskey = await AegisAes.buildKey(rxHex, ryHex, rZHex, slHex, AegisAesManager.ITERATION_COUNT);
    return this.aeskey;
  }

  private isValid(hex: string, length: number) {
    if (hex && hex.length == length) {
      return true;
    }
    return false;
  }

}