const genRanHex = (size:any) => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

/**
 * 要求鸿蒙SDK版本》=3.2.7.5
 */
export class AegisRandom {
  public static async random(randLen: number): Promise<string> {
    return Promise.resolve(genRanHex(randLen*2));
  }
}

