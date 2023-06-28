import { ApiManager } from '@hw-agconnect/api-ohos'
import agconnect from '@hw-agconnect/api-ohos'
import { StorageManagementImpl } from './src/main/ets/storage-management-impl';

import { AGCInstance } from '@hw-agconnect/core-ohos';
import { StorageInstance } from "./src/main/ets/utils/storageinstance";

const apiName = 'cloudStorage';

export type { Metadata } from './src/main/ets/metadata'

const creator = new StorageInstance((args) => {
  let agcInstance: AGCInstance;
  let bucket = undefined;
  if (args && args[0] && typeof args[0] === 'object') {
    agcInstance = args[0] as AGCInstance;
    bucket = args[1];
  } else if (args) {
    agcInstance = agconnect.instance();
    bucket = args[0];
  } else {
    agcInstance = agconnect.instance();
  }
  return new StorageManagementImpl(agcInstance, bucket);
});

function main(container: ApiManager) {
  container.registerApiProvider(apiName, (args?: any[]) => creator.get(args));
}

main(agconnect as ApiManager);
