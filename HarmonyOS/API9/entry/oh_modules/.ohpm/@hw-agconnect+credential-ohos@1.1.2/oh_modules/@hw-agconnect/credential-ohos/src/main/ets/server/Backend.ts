import { Http, HttpOptions, HttpResponse, Method } from "@hw-agconnect/base-ohos"
import { BaseRequest } from "./BaseRequest"
import { Logger } from "@hw-agconnect/base-ohos"
import agconnect from "@hw-agconnect/api-ohos";
import {AGCError, AGCErrorCode} from "@hw-agconnect/core-ohos";

const TAG: string = "Backend";

export class Backend {
  static async post(request: BaseRequest, options?: AGCHttpOptions): Promise<any> {
    return this.sendRequest("POST", request, options);
  }

  static async sendRequest(method: Method, request: BaseRequest, options?: AGCHttpOptions): Promise<any> {
    return new Promise((resolve, reject) => {
        if(!options?.responseInterceptor){
          options = {
            connectTimeout:options?.connectTimeout,
            readTimeout:options?.readTimeout,
            accessToken:options?.accessToken,
            clientToken:options?.clientToken,
            responseInterceptor:new DefaultResponseInterceptor(method, request, options)
          }
        }
        this.send(method, request, options).then((result) => {
          if(options?.responseInterceptor?.fulfilled){
            resolve(options.responseInterceptor.fulfilled(result));
          }
        }).catch((err) => {
          if(options?.responseInterceptor?.rejected){
            resolve(options.responseInterceptor.rejected(err));
          }
        })
    });
  }

  static async send(method: Method, request: BaseRequest, options?: AGCHttpOptions): Promise<any> {
    let header = await request.getHeader();
    if (options?.clientToken && !header?.Authorization) {
      let token = await agconnect.credential(request.identifier).getToken();
      header.Authorization = "Bearer " + token.tokenString;
    }
    let httpData = {
      header: header,
      body: await request.getBody()
    }
    let url = await request.getUrl();
    return await Http.sendRequest(url, method, httpData, options);
  }

  /**
   * 主地址失效后，备用地址访问
   * @param code code 3:端口号超标； code 6：url地址错误；7：端口连不上；60：端口不匹配；28：超时
   * @returns
   */
  static unKnowHost(code: number): boolean {
    return code == 3
      || code == 6
      || code == 7
      || code == 60
      || code == 28;
  }
}

export interface Interceptor{
  fulfilled: (data: any) => any;
  rejected: (error: any) => any
}

export class DefaultResponseInterceptor implements Interceptor{
  fulfilled: (data: any) => any;
  rejected: (error: any) => any
  constructor(method: Method, request: BaseRequest, options?: AGCHttpOptions) {
    this.fulfilled = (httpResponse: any) => {
      if (httpResponse?.responseCode == 200) {
        return Promise.resolve(httpResponse.result);
      } else {
        return Promise.reject(httpResponse);
      }
    }

    this.rejected = (error: any) => {
      return new Promise((resolve, reject) => {
        if (Backend.unKnowHost(error?.code) && !request.isBackUrl) {
          request.isBackUrl = true;
          Backend.send(method, request, options)
              .then((httpResponse) => { return resolve(httpResponse.result); })
              .catch((err) => {
                return reject(new AGCError(AGCErrorCode.AGC_HTTP_ERROR, JSON.stringify(err)))
              })
        } else {
          return reject(new AGCError(AGCErrorCode.AGC_HTTP_ERROR, JSON.stringify(error)));
        }
      })
    }
  }
}

export interface AGCHttpOptions extends HttpOptions {
  /**
   * 填充clientToken
   */
  clientToken?: boolean;

  /**
   * 填充accessToken
   */
  accessToken?: boolean;

  responseInterceptor?:Interceptor;
}
