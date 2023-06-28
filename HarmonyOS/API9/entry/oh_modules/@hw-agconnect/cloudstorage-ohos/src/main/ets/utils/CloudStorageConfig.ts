/**
 * @fileOverview this class is used to get agcconnect configuration
 */
import '@hw-agconnect/core-ohos';
import * as errorsExports from '../implementation/error';
import agconnect from '@hw-agconnect/api-ohos'

export class CloudStorageConfig {
  private static instance: CloudStorageConfig;
  private identifier: string;
  private _storageHosts: StorageConfig = {};
  private _defaultBucket: string = '';
  private _defaultRegion: string = '';
  private _addressThreshold: number = 3;

  constructor(identifier: string) {
    this.identifier = identifier;
  }

  async init() {
    let instanceConfig = await agconnect.instance(this.identifier).getConfig();
    if (instanceConfig && instanceConfig.region) {
      this._defaultRegion = instanceConfig.region;
    } else {
      this._defaultRegion = '';
      throw errorsExports.invalidConfig();
    }

    if (instanceConfig && instanceConfig.service && instanceConfig.service.cloudstorage) {
      this.generateUrl(instanceConfig.service.cloudstorage as StorageConfig);

      if (instanceConfig.service.cloudstorage.default_storage) {
        this._defaultBucket = instanceConfig.service.cloudstorage.default_storage;
      } else {
        this._defaultBucket = '';
      }
    }
  }

  public static initInstance(identifier: string): CloudStorageConfig {
    this.instance = new CloudStorageConfig(identifier);
    return this.instance;
  }

  public static getInstance(): CloudStorageConfig {
    return this.instance;
  }

  getHostByRegion(region: string): AddressCount {
    region = region ? region : this._defaultRegion;
    let reginKey = 'storage_url_' + region.toLowerCase();
    let temp = this._storageHosts[reginKey];
    let i = 0;
    for (; i < 2; i++) {
      let info = temp[String(i)] as AddressCount;
      if (!info) {
        throw errorsExports.invalidAddress();
      }
      if (info.count < this._addressThreshold) {
        return info;
      } else if (i === 1) {
        return info;
      }
    }
    throw errorsExports.invalidAddress();
  }

  clearHostCount(region: string, index: number) {
    let reginKey = 'storage_url_' + region.toLowerCase();
    let temp = this._storageHosts[reginKey];
    temp[index].count = 0;
    this._storageHosts[reginKey] = temp;
  }

  setHostCount(region: string, index: number) {
    if (index === 1) {
      return;
    }
    let reginKey = 'storage_url_' + region.toLowerCase();
    let temp = this._storageHosts[reginKey];
    temp[index].count += 1;
    this._storageHosts[reginKey] = temp;
  }

  defaultBucket(): string {
    return this._defaultBucket;
  }

  defaultRegion(): string {
    return this._defaultRegion;
  }

  private generateUrl(storage: StorageConfig): void {
    const regions = ['storage_url_cn', 'storage_url_sg', 'storage_url_ru', 'storage_url_de'];
    for (let region of regions) {
      let temp = {};
      for (let key in storage) {
        if (key === region) {
          temp = Object.assign({
            '0': {
              url: storage[key],
              index: 0,
              count: 0
            } as AddressCount
          }, temp);
        } else if (key.indexOf(region) !== -1) {
          temp = Object.assign({
            '1': {
              url: storage[key],
              index: 1,
              count: 0
            } as AddressCount
          }, temp);
        }
      }
      this._storageHosts[region] = temp
    }
  }
}

export interface AddressCount {
  url: string,
  index: number,
  count: number
}

interface StorageConfig {
  [key: string]: any
}
