import { ListOptions, ListResult, StorageManagement, StorageReference } from '../../../types';
import * as errorsExports from './implementation/error';
import { CSBlob } from './upload/file';
import { Location } from './implementation/location';
import * as path from './implementation/path';
import { UploadTaskImpl } from './task';
import { StorageManagementImpl } from './storage-management-impl';
import {
  forbiddenSymbol,
  listOptionSpec,
  metadataSpec,
  pathLengthSpec,
  uploadDataSpec,
  validate
} from './utils/validator';
import { ListRequest } from './server/request/ListRequest';
import { DeleteRequest } from './server/request/DeleteRequest';
import { GetDownloadUrlRequest } from './server/request/GetDownloadUrlRequest';

export class StorageReferenceImpl implements StorageReference {
  protected location: Location;
  private _area: string;

  constructor(protected storageManagement: StorageManagementImpl, area: string, location: string | Location) {
    this._area = area;
    if (location instanceof Location) {
      this.location = location;
    } else {
      this.location = Location.makeFromUrl(location);
    }
  }

  parent(): StorageReference | null {
    const newPath = path.parent(this.location.path());
    if (newPath === null) {
      return null;
    }
    const location = new Location(this.location.bucket, newPath);
    return this.newRef(this.storageManagement, this._area, location);
  }

  root(): StorageReference {
    const location = new Location(this.location.bucket, '');
    return this.newRef(this.storageManagement, this._area, location);
  }

  bucket(): string {
    return this.location.bucket;
  }

  path(): string {
    return this.location.path();
  }

  name(): string {
    return path.lastComponent(this.location.path());
  }

  storage(): StorageManagement {
    return this.storageManagement;
  }

  protected newRef(service: StorageManagementImpl, area: string, location: Location): StorageReference {
    return new StorageReferenceImpl(service, area, location);
  }

  child(childPath: string): StorageReference {
    validate('storagereference.child', [pathLengthSpec(forbiddenSymbol)], arguments);
    const newPath = path.child(this.location.path(), childPath);
    const location = new Location(this.location.bucket, newPath);
    return this.newRef(this.storageManagement, this._area, location);
  }

  delete() {
    this.throwIfDirectory_('be deleted', 'delete');
    return this.storageManagement.makeRequest(new DeleteRequest(this.storageManagement, this.location, this._area));
  }

  getDownloadURL(): Promise<string> {
    this.throwIfDirectory_('get download url', 'getDownloadURL');
    return this.storageManagement
      .makeRequest(new GetDownloadUrlRequest(this.storageManagement, this.location, this._area))
      .then(url => {
        if (url === null) {
          throw errorsExports.noDownloadURL();
        }
        return url;
      });
  }

  listAll(): Promise<ListResult> {
    const accumulator = {
      dirList: [],
      fileList: []
    };
    return this.listAllHelper(accumulator).then(() => accumulator);
  }

  private async listAllHelper(accumulator: ListResult, pageMarker?: string): Promise<void> {
    const opt: ListOptions = {
      pageMarker
    };
    const nextPage = await this.list(opt);
    accumulator.dirList.push.apply(accumulator.dirList, nextPage.dirList);
    accumulator.fileList.push.apply(accumulator.fileList, nextPage.fileList);
    if (nextPage.pageMarker != null) {
      await this.listAllHelper(accumulator, nextPage.pageMarker);
    }
  }

  list(options?: ListOptions | null): Promise<ListResult> {
    validate('storagereference.list', [listOptionSpec(true)], arguments);
    const self = this;
    const op = options || {};
    return self.storageManagement.makeRequest(new ListRequest(self.storageManagement, self.location, this._area, '/', op.pageMarker, op.maxResults));
  }

  putData(
    data: Uint8Array | ArrayBuffer): UploadTaskImpl {
    this.throwIfDirectory_('put file', 'put');
    validate('storagereference.putData', [uploadDataSpec(), metadataSpec(true)], arguments);
    this.throwIfRoot_('putData');
    return new UploadTaskImpl(this, this.storageManagement, this.location, new CSBlob(data), null, this._area);
  }

  toString(): string {
    return 'grs://' + this.location.bucket + '/' + this.location.path();
  }

  private throwIfRoot_(name: string): void {
    if (this.location.path() === '') {
      throw errorsExports.invalidRootOperation(name);
    }
  }

  private throwIfDirectory_(name: string, func: string): void {
    if (this.location.path() === '' || this.location.path().endsWith('/')) {
      throw errorsExports.invalidOperation(name, func);
    }
  }
}
