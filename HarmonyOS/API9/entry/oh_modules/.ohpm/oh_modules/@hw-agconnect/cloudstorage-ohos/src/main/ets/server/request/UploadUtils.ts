import {Metadata} from '../../metadata';
import {CSBlob} from "../../upload/file";
import {Location} from "../../implementation/location";
import * as MetadataUtils from "./MetaDataUtils";
import {unknown} from "../../implementation/error";
export const resumableUploadChunkSize: number = 100 * 1024;

export class ResumableUploadStatus {
    metadata: Metadata | null;
    finalized: boolean;

    constructor(
        public current: number,
        public total: number,
        finalized?: boolean,
        metadata?: Metadata | null
    ) {
        this.metadata = metadata || null;
        this.finalized = !!finalized;
    }
}
export function determineContentType_(
    metadata: Metadata | null,
    blob: CSBlob | null
): string {
    return (
        (metadata && metadata['contentType']) || (blob && blob.type()) || 'application/octet-stream'
    );
}

export function metadataForUpload_(
    blob: CSBlob,
    location: Location,
    metadata?: Metadata | null
): Metadata {
    const metadataClone = Object.assign({}, metadata);
    metadataClone['metadata'] = MetadataUtils.parseMetadata(metadataClone);
    metadataClone['path'] = location.path();
    metadataClone['size'] = blob.size();
    if (!metadataClone['contentType']) {
        metadataClone['contentType'] = determineContentType_(null, blob);
    }
    return metadataClone;
}

export function checkResumeHeader_(res: any, allowed?: string[]): string {
    let status: string | null = null;
    try {
        if (res) {
            status = res.uploadStatus;
        }
    } catch (e) {
        throw unknown();
    }
    const allowedStatus = allowed || ['active'];
    if (!status || allowedStatus.indexOf(status) == -1) {
        throw unknown();
    }
    return status as string;
}