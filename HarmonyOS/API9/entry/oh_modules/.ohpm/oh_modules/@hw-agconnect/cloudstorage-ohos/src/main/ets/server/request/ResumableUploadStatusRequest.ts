import {CloudStorageRequest} from "./CloudStorageRequest";
import {unknown} from "../../implementation/error";
import {StorageManagement} from "../../storage-management-impl";
import {Location} from '../../implementation/location';
import {Metadata} from "../../metadata";
import * as UrlUtils from "../../utils/url";
import {CSBlob} from "../../upload/file";
import {ResumableUploadStatus, checkResumeHeader_} from "./UploadUtils";

export class ResumableUploadStatusRequest extends CloudStorageRequest<ResumableUploadStatus> {
    private blob:CSBlob;
    constructor(storageManagement:StorageManagement, location:Location,  blob:CSBlob, area:string,metadata?:Metadata,
                delimiter?: string, marker?: string | null,maxKeys?: number | null,
    ) {
        super(storageManagement,
            location,
            UrlUtils.makeUrl(location.fullUrl()),
            'POST',
            {'x-agc-nsp-js': 'JSSDK'},
            area
        );
        this.blob = blob;
        this.headers = {
            'x-agc-nsp-js': 'JSSDK',
            'X-Agc-Upload-Protocol': 'resumable',
            'X-Agc-File-Size': blob.size(),
            'X-Agc-Sha256': blob.sha256()
        };
    }

    handle(status: number, res: any):ResumableUploadStatus{
        if (!res) {
            throw unknown();
        }
        res = JSON.parse(res);
        const uploadStatus = checkResumeHeader_(res, ['resumable', 'active', 'finalize']);
        if (uploadStatus === 'finalize') {
            return new ResumableUploadStatus(this.blob.size(), this.blob.size(), uploadStatus === 'finalize');
        }
        let sizeString = res.receiveBytes;

        if (!sizeString) {
            throw unknown();
        }

        const size = Number(sizeString);
        if (isNaN(size)) {
            throw unknown();
        }
        return new ResumableUploadStatus(size, this.blob.size(), uploadStatus === 'finalize');

    }
}