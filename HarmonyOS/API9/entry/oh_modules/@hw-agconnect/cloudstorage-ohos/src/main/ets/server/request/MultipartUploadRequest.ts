import {CloudStorageRequest} from "./CloudStorageRequest";
import {cannotSliceBlob, unknown} from "../../implementation/error";
import {StorageManagement} from "../../storage-management-impl";
import {Location} from '../../implementation/location';
import {Metadata} from "../../metadata";
import * as MetadataUtils from "./MetaDataUtils";
import * as UrlUtils from "../../utils/url";
import {CSBlob} from "../../upload/file";
import {metadataForUpload_} from "./UploadUtils";

export class MultipartUploadRequest extends CloudStorageRequest<Metadata> {
    constructor(storageManagement: StorageManagement, location: Location, blob: CSBlob, area: string, metadata?: Metadata | null, delimiter?: string, marker?: string | null, maxKeys?: number | null,
    ) {
        super(storageManagement,
            location,
            UrlUtils.makeUrl(location.fullUrl()),
            'PUT',
            {'x-agc-nsp-js': 'JSSDK'},
            area
        );
        const body = CSBlob.getBlob(blob);
        if (body === null) {
            throw cannotSliceBlob();
        }
        const metadata_ = metadataForUpload_(blob, location, metadata);
        this.headers = Object.assign({'x-agc-nsp-js': 'JSSDK'}, metadata_['metadata']);
        this.body = (body.uploadData() as Uint8Array).buffer;
    }

    handle(status: number, res: any): Metadata {
        if (!res) {
            throw unknown();
        }
        res = JSON.parse(res);
        const metadata = MetadataUtils.parseResponse(res.fileInfo);
        if (metadata == null) {
            throw unknown();
        }
        return metadata as Metadata;
    }
}