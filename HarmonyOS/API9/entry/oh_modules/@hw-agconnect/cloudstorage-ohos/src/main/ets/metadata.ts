import { StorageReference } from '../../../types';
/**
 * @fileOverview Full metadata
 */
export interface Metadata {
  bucket: string | undefined;
  path: string | undefined;
  name: string | undefined;
  size: number | undefined;
  ctime: string | undefined;
  mtime: string | undefined;
  sha256Hash: string | undefined;
  cacheControl: string | undefined;
  contentDisposition: string | undefined;
  contentEncoding: string | undefined;
  contentLanguage: string | undefined;
  contentType: string | undefined;
  customMetadata: { [key: string]: string } | undefined;
  ref: StorageReference | undefined;

  [prop: string]: unknown;
}

export interface ServiceMetadata {
  bucket: string | undefined;
  path: string | undefined;
  name: string | undefined;
  size: number | undefined;
  createTime: string | undefined;
  updateTime: string | undefined;
  sha256: string | undefined;
  cacheControl: string | undefined;
  contentDisposition: string | undefined;
  contentEncoding: string | undefined;
  contentLanguage: string | undefined;
  contentType: string | undefined;
  metadata: { [key: string]: string } | undefined;
  ref: StorageReference | undefined;
}
