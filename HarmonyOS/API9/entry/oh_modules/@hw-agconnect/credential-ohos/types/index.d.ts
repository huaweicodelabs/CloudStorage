import { AGCApi } from '@hw-agconnect/api-ohos';

declare module '@hw-agconnect/api-ohos' {
  interface AGCApi {
    credential(name?: string): Credential;
  }
}

declare module './index' {
  interface _ extends AGCApi {}
}

export interface Token {
  expiration: number;
  tokenString: string
}

export declare interface Credential {
  getToken(forceRefresh?: boolean): Promise<Token>;

  removeToken(): Promise<void>;
}

export { BaseRequest } from '../src/main/ets/server/BaseRequest';

export { BaseResponse } from '../src/main/ets/server/BaseResponse';

export { Backend, AGCHttpOptions } from '../src/main/ets/server/Backend';
