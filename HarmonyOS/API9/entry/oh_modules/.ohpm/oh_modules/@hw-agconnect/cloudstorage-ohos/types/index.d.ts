import { AGCApi } from '@hw-agconnect/api-ohos'
import { AGCInstance } from '@hw-agconnect/core-ohos';
import { TaskState } from '../src/main/ets/upload/taskenums';

declare module '@hw-agconnect/api-ohos' {
  interface AGCApi {
    cloudStorage: {
      (): StorageManagement,

      (bucket: string): StorageManagement,

      (agcInstance?: AGCInstance, bucket?: string): StorageManagement,
    }
  }
}

declare module './index' {
  interface _ extends AGCApi {}
}

export interface StorageReference {
  /**
   * 云端的存储实例名称
   */
  bucket():string;

  /**
   * 云端的路径信息
   */
  path():string;

  /**
   * 云端的文件名称
   */
  name():string;

  root(): StorageReference | null;

  parent(): StorageReference | null;

  child(path: string): StorageReference;

  delete(): Promise<void>;

  list(options?: ListOptions): Promise<ListResult>;

  listAll(): Promise<ListResult>;

  putData(data: Uint8Array | ArrayBuffer): UploadTask;

  getDownloadURL(): Promise<string>;

  toString(): string
}

export interface ListOptions {
  maxResults?: number;
  pageMarker?: string;
}

export interface ListResult {
  dirList: StorageReference[];
  fileList: StorageReference[];
  pageMarker?: string | null;
}

export interface UploadTask {
  on(type: string, callback: (uploadedSize: number, totalSize: number) => void): void;

  cancel(): boolean;

  then<T>(onfulfilled?: (value: UploadResult) => T): Promise<T>;

  catch(onRejected: (a: Error) => any): Promise<any>;
}

export interface UploadResult {
  bytesTransferred: number;
  state: TaskState;
  totalByteCount: number;
}

export interface StorageManagement {
  storageReference(path?: string): Promise<StorageReference>;
}

export { Metadata } from '../src/main/ets/metadata'
