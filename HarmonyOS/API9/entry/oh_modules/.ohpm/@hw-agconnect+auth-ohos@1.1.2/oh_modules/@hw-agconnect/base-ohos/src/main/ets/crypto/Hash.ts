import { Logger } from '../log/logger';
import CryptoJS from "../opensources/crypto-js"

const TAG: string = "AesCrypto";

export class Hash {
  static md5(str: string): string {
    try {
      return CryptoJS.MD5(str);
    } catch (e) {
      Logger.error(TAG, "CryptoJS md5 error" + e?.message);
    }
    return "";
  }

  static sha256(data: Uint8Array) {
    try {
      let sha256 = CryptoJS.algo.SHA256.create()
      let start = 0;
      let left = data.length;
      let chunk = 100 * 1024;
      while (left > 0) {
        let buf = data.slice(start, start + Math.min(chunk, left));
        start = start + chunk;
        left = left - chunk;
        let wordArray = CryptoJS.lib.WordArray.create(buf, buf.length);
        sha256.update(wordArray)
      }
      return sha256.finalize().toString();
    } catch (e) {
      Logger.error(TAG, "CryptoJS sha256 error" + e?.message);
    }
    return "";
  }
}