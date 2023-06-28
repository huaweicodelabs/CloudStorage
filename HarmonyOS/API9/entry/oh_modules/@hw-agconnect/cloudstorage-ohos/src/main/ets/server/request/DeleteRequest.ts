import {CloudStorageRequest} from "./CloudStorageRequest";
import {StorageManagement} from "../../storage-management-impl";
import {Location} from '../../implementation/location';
import * as UrlUtils from "../../utils/url";

export class DeleteRequest extends CloudStorageRequest<void> {
    constructor(
        storageManagement: StorageManagement,
        location: Location,
        area: string,
    ) {
        super(storageManagement,
            location,
            UrlUtils.makeUrl(location.fullUrl()),
            'DELETE',
            {'x-agc-nsp-js': 'JSSDK'},
            area
        );
        this.successCodes = [200, 204];
    }

    handle(status: number, res: any): void {
    }
}