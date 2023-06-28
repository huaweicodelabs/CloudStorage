import {
  AgconnectStorageError,
  Code,
  noPermission,
  objectNotFound,
  quotaExceeded,
  unauthenticated
} from '../../implementation/error';
import { BaseRequest } from "@hw-agconnect/credential-ohos";
import * as UrlUtils from "../../utils/url";
import { CloudStorageConfig } from "../../utils/CloudStorageConfig";
import { StorageManagement } from "../../storage-management-impl";
import { Location } from '../../implementation/location';

export interface UrlParams {
  [name: string]: string | number;
}

export class CloudStorageRequest<T> extends BaseRequest {
  urlParams: UrlParams = {};
  body: string | ArrayBuffer | Uint8Array | null = null;
  successCodes: number[] = [200];
  progressCallback?: (progressEvent: any) => void;
  uri: string = '';
  timeout: number;
  maxRetryTimes: number;
  area: string;
  ignoreRetryWaiting: boolean = false;

  constructor(
    public storageManagement: StorageManagement,
    public location: Location,
    public url: string,
    public method: string,
    public headers = {},
    area: string
  ) {
    super(storageManagement.identifier);

    this.headers = { 'x-agc-nsp-js': 'JSSDK' };
    this.timeout = storageManagement.maxRequestTimeout();
    this.maxRetryTimes = storageManagement.maxRetryTimes();
    this.ignoreRetryWaiting = storageManagement.ignoreRetryWaiting();
    this.area = area
  }

  async getBody(): Promise<any> {
    return Promise.resolve((this.body === undefined || this.body === '') ? {} : this.body);
  }

  async getHeader(): Promise<any> {
    let header = await super.getHeader();
    header = Object.assign(header, this.headers, { 'Content-Type': 'text/plain', 'app_id': await super.getAppId() });
    return Promise.resolve(header);
  }

  async getUrl(): Promise<string> {
    const queryPart = UrlUtils.makeQueryString(this.urlParams);
    let config = CloudStorageConfig.getInstance();

    const urlInfo = config.getHostByRegion(this.area);
    const url = urlInfo.url + this.url + queryPart;
    return Promise.resolve(url);
  }

  setAuthToken(authToken: Headers) {
    this.headers = Object.assign(this.headers, authToken);
  }

  handleError(status: number, error: any): AgconnectStorageError {
    let newErr: AgconnectStorageError;
    switch (status) {
      case 401:
        newErr = unauthenticated();
        break;
      case 402:
        newErr = quotaExceeded();
        break;
      case 403:
        newErr = noPermission();
        break;
      case 404:
        newErr = objectNotFound();
        break;
      default:
        newErr = new AgconnectStorageError(Code.UNKNOWN, error);
    }

    if (!error) {
      newErr.setServerResponse('error request response is null or undefined.');
    } else {
      newErr.setServerResponse(error);
    }
    return newErr;
  }

  handle(status: number, res: any): T {
    return res;
  }
}

export interface Headers {
  [name: string]: string;
}
