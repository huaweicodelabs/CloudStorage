import cryptoFramework from '@ohos.security.cryptoFramework';

export class FrameworkCrypto {
  static async ohGenAesCbcEncryptWithIv(plain: string, workKey: string, iv: string): Promise<string> {
    if (!plain || !workKey || !iv) {
      return plain;
    }
    let result = '';

    // 创建对称密钥生成器
    let symKeyGenerator = cryptoFramework.createSymKeyGenerator('AES256');
    let keyDataBlob = { data: hexStringToUint8Array(workKey) };
    let sysKey = await symKeyGenerator.convertKey(keyDataBlob);

    // 生成加解密生成器
    let cipherAlgName = 'AES256|CBC|PKCS5';
    let params = { iv: { data: hexStringToUint8Array(iv) }, algName: 'IvParamsSpec' };

    // 创建Cipher对象
    let globalCipher = cryptoFramework.createCipher(cipherAlgName);

    // init
    await globalCipher.init(cryptoFramework.CryptoMode.ENCRYPT_MODE, sysKey, params);

    // update  算法库不限定update的次数和每次加解密的数据量，需要业务验证大数据量情况下的性能
    let cipherText = { data: stringToUint8Array(plain) };
    let updateOutput = await globalCipher.update(cipherText);
    if (updateOutput && updateOutput.data) {
      result += uint8ArrayTohexString(updateOutput.data);
    }
    // doFinal
    let finalOutput = await globalCipher.doFinal(null);
    if (finalOutput && finalOutput.data) {
      result += uint8ArrayTohexString(finalOutput.data);
    }
    return result;
  }

  static async ohGenAesCbcDecryptWithIv(plain: string, workKey: string, iv: string): Promise<string> {
    if (!plain || !workKey || !iv) {
      return plain;
    }
    let result = '';
    // 创建对称密钥生成器
    let symKeyGenerator = cryptoFramework.createSymKeyGenerator('AES256');
    let keyDataBlob = { data: hexStringToUint8Array(workKey) };
    let sysKey = await symKeyGenerator.convertKey(keyDataBlob);

    // 生成加解密生成器
    let cipherAlgName = 'AES256|CBC|PKCS5';
    let params = { iv: { data: hexStringToUint8Array(iv) }, algName: 'IvParamsSpec' };

    // 创建Cipher对象
    let globalCipher = cryptoFramework.createCipher(cipherAlgName);

    // init
    await globalCipher.init(cryptoFramework.CryptoMode.DECRYPT_MODE, sysKey, params);
    // update  算法库不限定update的次数和每次加解密的数据量，需要业务验证大数据量情况下的性能
    let cipherText = { data: hexStringToUint8Array(plain) };
    let updateOutput = await globalCipher.update(cipherText);
    if (updateOutput && updateOutput.data) {
      result += uint8ArrayToString(updateOutput.data);
    }

    // doFinal
    let finalOutput = await globalCipher.doFinal(null);
    if (finalOutput && finalOutput.data) {
      result += uint8ArrayToString(finalOutput.data);
    }
    return result;
  }
}

/**
 * 16进制的HEX字符串转成Uint8Array
 * @param hexString hex string
 * @returns Uint8Array
 */
function hexStringToUint8Array(hexString) {
  return Uint8Array.from(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
}

/**
 * Uint8Array转成 hexstring
 * @param bytes
 * @returns
 */
function uint8ArrayTohexString(bytes) {
  return bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
}

/**
 * uint8Array转普通字符串
 *
 * @param array uint8Array
 * @returns string
 */
function uint8ArrayToString(array) {
  let arrayString = '';
  for (let i = 0; i < array.length; i++) {
    arrayString += String.fromCharCode(array[i]);
  }
  return arrayString;
}

// 可理解的字符串转成字节流
function stringToUint8Array(str) {
  let arr = [];
  for (let i = 0, j = str.length; i < j; ++i) {
    arr.push(str.charCodeAt(i));
  }
  return new Uint8Array(arr);
}