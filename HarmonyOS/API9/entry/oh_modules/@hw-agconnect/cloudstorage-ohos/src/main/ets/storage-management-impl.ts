import { StorageReferenceImpl } from './storage-reference-impl';
import { StorageManagement, StorageReference } from '../../../types';
import { Location } from './implementation/location';
import { CloudStorageRequest } from "./server/request/CloudStorageRequest";
import { CloudStorageConfig } from "./utils/CloudStorageConfig";
import * as Validator from './utils/validator';

import * as errorsExports from "./implementation/error";
import * as constants from "./implementation/constants";
import { AGCInstance, AGCRoutePolicy } from '@hw-agconnect/core-ohos';

import { Region } from './model/model';
import { CloudStorageBackend } from "./server/CloudStorageBackend";

import agconnect from '@hw-agconnect/api-ohos'
import "@hw-agconnect/core-ohos";
import "@hw-agconnect/credential-ohos";
import "@hw-agconnect/auth-ohos";

export class StorageManagementImpl implements StorageManagement {
  public readonly identifier: string;
  private _bucket: Location | string = '';
  private _config: CloudStorageConfig;
  private _maxRequestTimeout: number;
  private _maxUploadTimeout: number;
  private _maxRetryTimes: number;
  private _bucketName: string | undefined;
  private readonly _cloudStorageBackend: CloudStorageBackend;
  private _ignoreRetryWaiting: boolean = false;

  constructor(agcInstance: AGCInstance, bucket: string) {
    this._maxRequestTimeout = constants.DEFAULT_MAX_REQUEST_TIMEOUT;
    this._maxUploadTimeout = constants.DEFAULT_MAX_UPLOAD_TIMEOUT;
    this._maxRetryTimes = constants.DEFAULT_MAX_RETRY_TIMES;

    this.identifier = agcInstance.name();
    this._bucketName = bucket;
    this._config = CloudStorageConfig.initInstance(this.identifier);
    this._cloudStorageBackend = new CloudStorageBackend(this.identifier);
  }

  private async init() {
    await this._config.init();
    if (this._bucketName != null) {
      this._bucket = Location.makeFromBucket(this._bucketName);
    } else if (this._config.defaultBucket() == '') {
      throw errorsExports.invalidConfig();
    } else {
      this._bucket = Location.makeFromBucket(this._config.defaultBucket());
    }
  }

  async storageReference(path?: string): Promise<StorageReference> {
    StorageManagementImpl.validatePath(path);
    await this.init();
    if (this._bucket === null) {
      throw errorsExports.noDefaultBucket();
    }

    const routePolicy = await agconnect.instance(this.identifier).getRoutePolicy();
    const area = this.getAreaByPolicy(routePolicy);
    const ref: StorageReference = new StorageReferenceImpl(this, area, this._bucket);
    if (path) {
      return Promise.resolve(ref.child(path));
    } else {
      return Promise.resolve(ref);
    }
  }

  private static validatePath(path?: string) {
    Validator.validate('storagemanagement.storageReference', [Validator.stringSpec(Validator.forbiddenSymbol, true)], arguments);
  }

  maxUploadTimeout(): number {
    return this._maxUploadTimeout;
  }

  maxRequestTimeout(): number {
    return this._maxRequestTimeout;
  }

  maxRetryTimes(): number {
    return this._maxRetryTimes;
  }

  setMaxRetryTimes(value: number) {
    Validator.validate('storageManagement.setMaxRetryTimes', [Validator.nonNegativeNumberSpec()], arguments);
    this._maxRetryTimes = value;
  }

  setIgnoreRetryWaiting(value: boolean) {
    this._ignoreRetryWaiting = value;
  }

  ignoreRetryWaiting():boolean{
    return this._ignoreRetryWaiting;
  }

  makeStorageReference(location: Location, area: string): StorageReference {
    return new StorageReferenceImpl(this, area, location);
  }

  makeRequest(requestInfo: CloudStorageRequest<any>, retryTimes: number = 1, lastUrl?: string): Promise<any> {
    return this._cloudStorageBackend.makeRequest(requestInfo, retryTimes, lastUrl);
  }

  private getAreaByPolicy(policy: AGCRoutePolicy): string {
    switch (policy) {
      case AGCRoutePolicy.UNKNOWN:
        return this._config.defaultRegion();
      case AGCRoutePolicy.CHINA:
        return Region.CN;
      case AGCRoutePolicy.GERMANY:
        return Region.DE;
      case AGCRoutePolicy.RUSSIA:
        return Region.RU;
      case AGCRoutePolicy.SINGAPORE:
        return Region.SG;
      default:
        return this._config.defaultRegion();
    }
  }
}
