import agconnect from "@hw-agconnect/api-ohos";
import "@hw-agconnect/core-ohos";
import "@hw-agconnect/credential-ohos";
import "@hw-agconnect/auth-ohos";
import { AGCHttpOptions, Backend } from '@hw-agconnect/credential-ohos'
import { AGCError, AGCErrorCode } from '@hw-agconnect/core-ohos'
import { Headers, CloudStorageRequest } from "./request/CloudStorageRequest";
import { Method } from '@hw-agconnect/base-ohos';
import * as errorsExports from "../implementation/error";
import { AddressCount, CloudStorageConfig } from "../utils/CloudStorageConfig";
import { sleep } from "../utils/sleep";

export class CloudStorageBackend {
  static readonly TAG = 'CloudStorageBackend';
  private identifier: string;

  constructor(identifier: string) {
    this.identifier = identifier;
  }

  private async doRequest(
    requestInfo: CloudStorageRequest<any>, option: AGCHttpOptions
  ): Promise<any> {
    await this.getAuthToken().then(authToken => {
      requestInfo.setAuthToken(authToken);
    }).catch(error => {
      return Promise.reject(error);
    })

    return Backend.sendRequest(requestInfo.method as Method, requestInfo, option);
  }

  private async getAuthToken(): Promise<Headers> {
    let credentialProvider = agconnect.credential(this.identifier);
    if (!credentialProvider) {
      return Promise.reject(errorsExports.internalError('get credentialProvider service failed.'));
    }
    let authorization: string = '';
    await credentialProvider.getToken().then((token: any) => {
      authorization = "Bearer " + token.tokenString;
    }).catch((e: any) => {
      return Promise.reject(e)
    })

    let accessToken: string = '';
    let authProvider = agconnect.auth(this.identifier);
    if (!authProvider) {
      return Promise.reject(errorsExports.internalError('get authProvider service failed.'));
    }
    let currentUser = await authProvider.getCurrentUser();
    if (currentUser) {
      await currentUser.getToken(false).then((res: any) => {
        if (res) {
          accessToken = res.getToken()
        }
      }).catch((e: any) => {
        return Promise.reject(e)
      })
    }

    return {
      Authorization: authorization,
      access_token: accessToken
    }
  }

  public makeRequest(
    requestInfo: CloudStorageRequest<any>,
    retryTimes: number,
    lastUrl?: string
  ): Promise<any> {
    let config = CloudStorageConfig.getInstance();
    const urlInfo = config.getHostByRegion(requestInfo.area);
    let option: AGCHttpOptions = {
      readTimeout: requestInfo.timeout,
      connectTimeout: requestInfo.timeout,
      responseInterceptor: {
        fulfilled: (response) => {
          return (response?.responseCode == 200) ? this.doThen(requestInfo, response, urlInfo) :
          this.doCatch(requestInfo, response.responseCode, response.result, retryTimes, urlInfo.url,
              lastUrl === urlInfo.url ? urlInfo : undefined);
        },
        rejected: (error) => {
          return this.doCatch(requestInfo, AGCErrorCode.AGC_HTTP_ERROR, error, retryTimes, urlInfo.url,
              lastUrl === urlInfo.url ? urlInfo : undefined);
        }
      }
    }
    return this.doRequest(requestInfo, option);
  }

  private doThen(
    requestInfo: CloudStorageRequest<any>,
    res: any,
    addressCount: AddressCount
  ): Promise<any> {
    let config = CloudStorageConfig.getInstance();
    config.clearHostCount(requestInfo.area, addressCount.index);
    const result = requestInfo.handle(res.responseCode, res.result);
    return Promise.resolve(result);
  }

  private async doCatch(
    requestInfo: CloudStorageRequest<any>,
    errorCode: number,
    errorMsg: any,
    retryTimes: number,
    url: string,
    addressCount?: AddressCount
  ): Promise<any> {
    if (addressCount && Backend.unKnowHost(errorCode)) {
      let config = CloudStorageConfig.getInstance();
      config.setHostCount(requestInfo.area, addressCount.index);
    }
    if (retryTimes >= requestInfo.maxRetryTimes) {
      const result = errorCode == AGCErrorCode.AGC_HTTP_ERROR ? new AGCError(AGCErrorCode.AGC_HTTP_ERROR, errorMsg) :
        requestInfo.handleError && requestInfo.handleError(errorCode, errorMsg);
      return Promise.reject(result);
    } else {
      if (!requestInfo.ignoreRetryWaiting) {
        let waitSeconds: number = retryTimes < 6 ? Math.pow(2, retryTimes + 1) : 64;
        await sleep(waitSeconds * 1000);
      }
      return this.makeRequest(requestInfo, retryTimes + 1, url); // 重试
    }
  }
}