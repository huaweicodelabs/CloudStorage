import {CloudStorageRequest} from "./CloudStorageRequest";
import {StorageManagement} from "../../storage-management-impl";
import {Location} from "../../implementation/location";
import agconnect from "@hw-agconnect/api-ohos";
import fileio from '@ohos.fileio';
import {Logger} from "@hw-agconnect/base-ohos";

export class DownLoadRequest extends CloudStorageRequest<any>{
    constructor(storageManagement: StorageManagement,
                location: Location,
                area: string,
                downLoadUrl:string) {
        super(storageManagement,
            location,
            downLoadUrl,
            'GET',
            {'x-agc-nsp-js': 'JSSDK'},
            area
        );
    }

    handle(status: number, res: any): any{
        let data = res.result;
        let context = agconnect.instance().getContext();
        let filePath = (context as any).filesDir;
        let file = filePath + "/" + 'test.txt';
        let stream = fileio.createStreamSync(file, 'w+');
        let writeNumber = stream.writeSync(data);
        if (data.length == writeNumber) {
            Logger.info("FileStorage", "stream.writeSync success");
        }
        stream.closeSync();
        return res;
    }
}