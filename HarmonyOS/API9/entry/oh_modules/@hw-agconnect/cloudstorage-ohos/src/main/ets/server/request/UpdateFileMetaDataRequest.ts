import {CloudStorageRequest} from "./CloudStorageRequest";
import {unknown} from "../../implementation/error";
import {StorageManagement} from "../../storage-management-impl";
import {Location} from '../../implementation/location';
import {Metadata} from "../../metadata";
import * as MetadataUtils from "./MetaDataUtils";
import * as UrlUtils from "../../utils/url";
export class UpdateFileMetaDataRequest extends CloudStorageRequest<Metadata> {
    constructor(storageManagement:StorageManagement, location:Location, metadata:Metadata, area:string,
                 delimiter?: string, marker?: string | null,maxKeys?: number | null,
    ) {
        super(storageManagement,
            location,
            UrlUtils.makeUrl(location.fullUrl()) + '?metadata=update',
            'GET',
            {'x-agc-nsp-js': 'JSSDK'},
            area
        );
        this.headers = Object.assign({'x-agc-nsp-js': 'JSSDK'}, MetadataUtils.parseMetadata(metadata));
    }

    handle(status: number, res: any):Metadata{
        if (!res) {
            throw unknown();
        }
        res = JSON.parse(res);
        const metadata = MetadataUtils.parseResponse(res);
        if (metadata == null) {
            throw unknown();
        }
        return metadata as Metadata;
    }
}