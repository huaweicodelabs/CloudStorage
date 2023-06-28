import {CloudStorageRequest} from "./CloudStorageRequest";
import {unknown} from "../../implementation/error";
import {StorageManagement} from "../../storage-management-impl";
import {Location} from '../../implementation/location';
import {Metadata} from "../../metadata";
import * as UrlUtils from "../../utils/url";
import * as MetadataUtils from './MetaDataUtils';
import {checkResumeHeader_, metadataForUpload_} from "./UploadUtils";
import {CSBlob} from "../../upload/file";
import {ResumableUploadStatus} from "./UploadUtils";

export class ContinueResumableUploadRequest extends CloudStorageRequest<ResumableUploadStatus> {
    private blob: CSBlob;
    private status_:ResumableUploadStatus;
    private bytesToUpload:number;
    constructor(
        storageManagement: StorageManagement,
        location: Location,
        blob: CSBlob,
        chunkSize: number,
        area: string,
        body: Uint8Array,
        status: ResumableUploadStatus,
        bytesToUpload:number,
        metadata?: Metadata | null,
        progressCallback?: (progressEvent: any) => void
    ) {
        super(storageManagement,
            location,
            UrlUtils.makeUrl(location.fullUrl()),
            'PUT',
            {'x-agc-nsp-js': 'JSSDK'},
            area
        );
        this.status_ = status;
        this.bytesToUpload = bytesToUpload;
        this.blob = blob;
        this.headers = {
            'x-agc-nsp-js': 'JSSDK',
            'X-Agc-File-Size': status.total.toString(),
            'X-Agc-File-Offset': status.current.toString(),
            'X-Agc-Sha256': blob.sha256()
        };
        const metadata_ = metadataForUpload_(blob, location, metadata);
        this.headers = Object.assign(this.headers, metadata_['metadata']);
        this.body = (body as Uint8Array).buffer;
    }
    metadataHandler(status: number, res: any): Metadata {
        const metadata = MetadataUtils.parseResponse(res);
        if (metadata == null) {
            throw unknown();
        }
        return metadata as Metadata;
    }

    handle(status: number, res: any): ResumableUploadStatus {
        if (!res) {
            throw unknown();
        }
        res = JSON.parse(res);
        const uploadStatus = checkResumeHeader_(res, ['resumable', 'active', 'finalize']);
        const newCurrent = this.status_.current + this.bytesToUpload;
        const size = this.blob.size();
        let metadata;
        if (uploadStatus === 'finalize') {
            metadata = this.metadataHandler(status, {data: res.fileInfo});
        } else {
            metadata = null;
        }
        return new ResumableUploadStatus(
            newCurrent,
            size,
            uploadStatus === 'finalize',
            metadata
        );
    }
}