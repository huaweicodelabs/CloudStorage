import {CloudStorageRequest} from "./CloudStorageRequest";
import {StorageManagement} from "../../storage-management-impl";
import {Location} from '../../implementation/location';
import * as UrlUtils from "../../utils/url";
import {CloudStorageConfig} from "../../utils/CloudStorageConfig";
import {unknown} from "../../implementation/error";

export class GetDownloadUrlRequest extends CloudStorageRequest<string | null> {

    constructor(
        storageManagement: StorageManagement,
        location: Location,
        area: string,
    ) {
        super(storageManagement,
            location,
            UrlUtils.makeUrl(location.fullUrl()) + '?token=create',
            'GET',
            {'x-agc-nsp-js': 'JSSDK'},
            area
        );
    }

    handle(status: number, res: any): string|null {
        if (!res) {
            throw unknown();
        }
        res = JSON.parse(res);
        const urlInfo = CloudStorageConfig.getInstance().getHostByRegion(this.area);
        return urlInfo.url + UrlUtils.makeUrl(this.location.fullUrl()) + '?token=' + res[0];

    }
}