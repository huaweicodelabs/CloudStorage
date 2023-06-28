import { UploadResult } from '../../../types';
import { TaskState } from './upload/taskenums';

export class UploadResultImpl implements UploadResult {
  constructor(readonly bytesTransferred: number, readonly totalByteCount: number, readonly state: TaskState) {
  }
}
