import {CONFIG_STORAGE_BUCKET_KEY} from './constants';

export class AgconnectStorageError implements Error {
  private response_: string | null;
  private name_: string;
  private code_: string;
  private message_: string;

  constructor(code: Code, message: string) {
    this.code_ = prependCode(code);
    this.message_ = 'Agconnect Storage: ' + message;
    this.response_ = null;
    this.name_ = 'AgconnectError';
    this.message = message;
    this.name = 'AgconnectError';
  }

  getCode(): string {
    return this.code_;
  }

  codeEquals(code: Code): boolean {
    return prependCode(code) === this.getCode();
  }

  setServerResponse(response: string | null): void {
    this.response_ = response
  }

  getName(): string {
    return this.name_;
  }

  getMessage(): string {
    return this.message_;
  }

  response(): null | string {
    return this.response_;
  }

  code(): string {
    return this.code_;
  }

  message: string;
  name: string;
}

export const errors = {};

export function prependCode(code: Code): string {
  return 'storage/' + code;
}

export function unknown(): AgconnectStorageError {
  const message = 'An unknown error occurred, please check the serverResponse information';
  return new AgconnectStorageError(Code.UNKNOWN, message);
}

export function objectNotFound(): AgconnectStorageError {
  const message = 'Object does not exist.';
  return new AgconnectStorageError(Code.OBJECT_NOT_FOUND, message);
}

export function quotaExceeded(): AgconnectStorageError {
  const message = 'The quota of the bucket has been used up. Please check the payment plan.';
  return new AgconnectStorageError(Code.QUOTA_EXCEEDED, message);
}

export function unauthenticated(): AgconnectStorageError {
  const message = 'Identity authentication failed. Please login again and try again.';
  return new AgconnectStorageError(Code.UNAUTHENTICATED, message);
}

export function noPermission(): AgconnectStorageError {
  const message = 'User does not have permission to access the file or directory.';
  return new AgconnectStorageError(Code.NO_PERMISSION, message);
}

export function retryLimitExceeded(): AgconnectStorageError {
  const message = 'Max retry time for operation exceeded. Please try again.';
  return new AgconnectStorageError(Code.RETRY_LIMIT_EXCEEDED, message);
}

export function canceled(): AgconnectStorageError {
  const message = 'The operation was cancelled.';
  return new AgconnectStorageError(Code.CANCELED, message);
}

export function noAGCInstance(): AgconnectStorageError {
  const message = 'Find no AGCConnect instance. Please init it at first.';
  return new AgconnectStorageError(Code.NO_AGCCONNECT_INSTANCE, message);
}

export function invalidConfig(): AgconnectStorageError {
  const message = 'Get CloudStorage configuration failed. Please check it again.';
  return new AgconnectStorageError(Code.INCALID_CONFIG, message);
}

export function invalidUrl(): AgconnectStorageError {
  const message = 'Invalid url';
  return new AgconnectStorageError(Code.INVALID_URL, message);
}

export function invalidDefaultBucket(): AgconnectStorageError {
  const message = 'Invalid default bucket';
  return new AgconnectStorageError(
      Code.INVALID_DEFAULT_BUCKET, message);
}

export function noDefaultBucket(): AgconnectStorageError {
  const message = 'No default bucket found. Please set the ' + CONFIG_STORAGE_BUCKET_KEY + ' property when initializing the configuration.';
  return new AgconnectStorageError(Code.NO_DEFAULT_BUCKET, message);
}

export function cannotSliceBlob(): AgconnectStorageError {
  const message = 'Failed to slice blob for upload. Please retry the upload.';
  return new AgconnectStorageError(Code.CANNOT_SLICE_BLOB, message);
}

export function serverFileWrongSize(): AgconnectStorageError {
  const message = 'Server recorded incorrect upload file size, please retry the upload.';
  return new AgconnectStorageError(Code.SERVER_FILE_WRONG_SIZE, message);
}

export function noDownloadURL(): AgconnectStorageError {
  const message = 'The given file does not have any download URLs.';
  return new AgconnectStorageError(Code.NO_DOWNLOAD_URL, message);
}

export function invalidRootOperation(name: string): AgconnectStorageError {
  const message = 'The operation' + name + 'cannot be performed on a root reference.';
  return new AgconnectStorageError(Code.INVALID_ROOT_OPERATION, message);
}

/**
 * @param name The name of the operation that was invalid.
 * @param func function name
 * @return {AgconnectStorageError}
 */
export function invalidOperation(name: string, func: string): AgconnectStorageError {
  const message = 'Only file can ' + name + ' and ' + func + '() don\'t supported at the root of bucket';
  return new AgconnectStorageError(Code.INVALID_OPERATION, message);
}

export function invalidFormat(
    format: string,
    message: string
): AgconnectStorageError {
  const msg = 'String format does not match supported format';
  return new AgconnectStorageError(Code.INVALID_FORMAT, msg);
}

export function internalError(message: string): AgconnectStorageError {
  throw new AgconnectStorageError(Code.INTERNAL_ERROR, 'Internal error: ' + message);
}

export function invalidArgumentCount(
    minArgs: number,
    maxArgs: number,
    name: string,
    length: number
): AgconnectStorageError {
  let countArgs = 'between ' + minArgs + ' and ' + maxArgs;
  let complex = 'arguments';
  if(minArgs === maxArgs){
    countArgs = minArgs.toString();
  }
  if(minArgs === 1 && maxArgs === 1){
    complex = 'argument';
  }
  const message = 'Invalid argument count in `' + name + '`: Expected ' + countArgs + ' ' + complex + ', received ' + length + '.';
  return new AgconnectStorageError(Code.INVALID_ARGUMENT_COUNT, message);
}

export function invalidArgument(
    index: number,
    name: string,
    message: string
): AgconnectStorageError {
  const errorMessage = 'Invalid argument in `' + name + '` at index ' + index + ': ' + message;
  return new AgconnectStorageError(Code.INVALID_ARGUMENT, errorMessage);
}

export function invalidAddress() {
  const msg = 'Can not find any valid urls, please check your SDK code copied from website again.';
  return new AgconnectStorageError(Code.INCALID_CONFIG, msg);
}

export type Code = string;
export const Code = {
  UNKNOWN: 'unknown',
  OBJECT_NOT_FOUND: 'object-not-found',
  QUOTA_EXCEEDED: 'quota-exceeded',
  UNAUTHENTICATED: 'unauthenticated',
  NO_PERMISSION: 'noPermission',
  RETRY_LIMIT_EXCEEDED: 'retry-limit-exceeded',
  INVALID_CHECKSUM: 'invalid-checksum',
  CANCELED: 'canceled',
  NO_AGCCONNECT_INSTANCE: 'no-agcconnect-instance',
  INCALID_CONFIG: 'invalid-config',
  INVALID_DEFAULT_BUCKET: 'invalid-default-bucket',
  INVALID_URL: 'invalid-url',
  CANNOT_SLICE_BLOB: 'cannot-slice-blob',
  NO_DEFAULT_BUCKET: 'no-default-bucket',
  NO_DOWNLOAD_URL: 'no-download-url',
  SERVER_FILE_WRONG_SIZE: 'server-file-wrong-size',
  INVALID_ARGUMENT: 'invalid-argument',
  APP_DELETED: 'app-deleted',
  INVALID_ARGUMENT_COUNT: 'invalid-argument-count',
  INVALID_OPERATION: 'invalid-operation',
  INVALID_FORMAT: 'invalid-format',
  INVALID_ROOT_OPERATION: 'invalid-root-operation',
  INTERNAL_ERROR: 'internal-error'
};
