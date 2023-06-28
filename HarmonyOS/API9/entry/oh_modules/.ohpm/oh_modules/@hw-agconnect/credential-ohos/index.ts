import { ApiManager } from '@hw-agconnect/api-ohos'
import agconnect from '@hw-agconnect/api-ohos'
import { CredentialImpl } from './src/main/ets/Credentialmpl';
import { InstanceMap } from '@hw-agconnect/core-ohos';

export { BaseRequest } from './src/main/ets/server/BaseRequest';
export { BaseResponse } from './src/main/ets/server/BaseResponse';
export { Backend } from './src/main/ets/server/Backend';

export type { AGCHttpOptions } from './src/main/ets/server/Backend';

export const creator = new InstanceMap((args: any[]) => {
    return new CredentialImpl(args[0]);
});

function main(container: ApiManager) {
    container.registerApiProvider('credential', (args?: any[]) => creator.get(args));
}

main(agconnect as ApiManager);
