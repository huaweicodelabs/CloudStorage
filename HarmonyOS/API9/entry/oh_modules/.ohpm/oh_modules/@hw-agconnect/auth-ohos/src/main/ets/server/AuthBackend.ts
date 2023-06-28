import agconnect from '@hw-agconnect/api-ohos'
import { Logger, Method } from '@hw-agconnect/base-ohos';
import {AGCError, AGCErrorCode, AGCInstance} from '@hw-agconnect/core-ohos'
import { Backend, BaseResponse } from '@hw-agconnect/credential-ohos';
import { AGCAuthError } from '../exception/AGCAuthError';
import { AuthBaseRequest } from './request/AuthBaseRequest';

export class AuthBackend {
  private instance: AGCInstance;

  constructor(name: string) {
    this.instance = agconnect.instance(name);
  }

  async get<T>(request: AuthBaseRequest, responseClass: BaseResponse): Promise<BaseResponse> {
    return this.sendRequest("GET", request, responseClass);
  }

  async post<T>(request: AuthBaseRequest, responseClass: BaseResponse): Promise<BaseResponse> {
    return this.sendRequest("POST", request, responseClass);
  }

  async put<T>(request: AuthBaseRequest, responseClass: BaseResponse): Promise<BaseResponse> {
    return this.sendRequest("PUT", request, responseClass);
  }

  async sendRequest(method: Method, request: AuthBaseRequest, responseClass: BaseResponse): Promise<BaseResponse> {
    let options = {
      clientToken: true
    };

    let response = await Backend.sendRequest(method, request, options).catch(error => {
      if (error?.code == AGCErrorCode.AGC_HTTP_ERROR && error?.message) {
        return Promise.reject(new AGCError(AGCErrorCode.AGC_HTTP_ERROR, error.message));
      }
      return Promise.reject(error)
    });
    
    let result = JSON.parse(response);
    if (result?.ret?.code == 0) {
      if (!responseClass.constructResponse(result)) {
        responseClass = result;
      }
      return responseClass
    } else if (result?.ret?.code != 0) {
      let authErrorCode = {
        code: result.ret.code,
        message: result.ret.msg
      }
      return Promise.reject(new AGCAuthError(authErrorCode))
    } else {
      return Promise.reject(result)
    }
  }

}