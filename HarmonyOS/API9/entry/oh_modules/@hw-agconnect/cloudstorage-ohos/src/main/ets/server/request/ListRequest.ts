import { StorageManagementImpl } from '../../storage-management-impl';
import { ListResult } from '../../../../../types';
import { CloudStorageRequest, UrlParams } from "./CloudStorageRequest";
import { unknown } from "../../implementation/error";
import { Location } from '../../implementation/location';
import * as UrlUtils from "../../utils/url";

interface ListMetadataResponse {
  key: string;
  lastModified: string;
  size: string;
}

interface prefixResponse {
  prefix: string;
}

interface ListResultResponse {
  commonPrefixes: prefixResponse[];
  contents: ListMetadataResponse[];
  nextMarker?: string;
}

const PAGE_MARKER_KEY = 'nextMarker';
const PREFIXES_KEY = 'commonPrefixes';
const Contents_KEY = 'contents';

export class ListRequest extends CloudStorageRequest<ListResult> {
  constructor(storageManagement: StorageManagementImpl, location: Location, area: string,
              delimiter?: string, marker?: string | null, maxKeys?: number | null,
  ) {
    super(storageManagement,
      location,
    UrlUtils.makeUrl(location.bucketUrl()),
      'GET',
      { 'x-agc-nsp-js': 'JSSDK' },
      area
    );
    const urlParams: UrlParams = {};
    if (location.isRoot()) {
      urlParams['prefix'] = '';
    } else {
      urlParams['prefix'] = location.path();
    }
    if (delimiter && delimiter.length > 0) {
      urlParams['delimiter'] = delimiter;
    }
    if (marker) {
      urlParams['marker'] = marker;
    }
    if (maxKeys) {
      urlParams['max-keys'] = maxKeys;
    }
    this.urlParams = urlParams;
  }

  handle(status: number, res: any): ListResult {
    if (!res) {
      throw unknown();
    }
    res = JSON.parse(res);
    const listResult = this.parseResponse(
    this.storageManagement,
    this.location,
    this.area,
      res
    );
    if (listResult === null) {
      throw unknown();
    }
    return listResult as ListResult;
  }

  parseResponse(
    storageManagement: StorageManagementImpl,
    location: Location,
    area: string,
    res: any
  ): ListResult | null {
    if (res === null) {
      return null;
    }
    const resource = (res as unknown) as ListResultResponse;
    const listResult: ListResult = {
      dirList: [],
      fileList: [],
      pageMarker: resource[PAGE_MARKER_KEY]
    };
    if (resource[Contents_KEY]) {
      for (const item of resource[Contents_KEY]) {
        const reference = storageManagement.makeStorageReference(
          new Location(location.bucket, item['key']),
          area
        );
        if (item['key'].endsWith('/')) {
          listResult.dirList.push(reference);
        } else {
          listResult.fileList.push(reference);
        }
      }
    }

    if (resource[PREFIXES_KEY]) {
      for (const path of resource[PREFIXES_KEY]) {
        const reference = storageManagement.makeStorageReference(
          new Location(location.bucket, path.prefix),
          area
        );
        listResult.dirList.push(reference);
      }
    }
    return listResult;
  }
}