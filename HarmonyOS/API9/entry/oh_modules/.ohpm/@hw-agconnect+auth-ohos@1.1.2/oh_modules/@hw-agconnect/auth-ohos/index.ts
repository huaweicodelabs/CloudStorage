import { ApiManager } from '@hw-agconnect/api-ohos'
import { InstanceMap } from '@hw-agconnect/core-ohos'
import { AGConnectAuthImpl } from './src/main/ets/AGConnectAuthImpl'
import agconnect from '@hw-agconnect/api-ohos'

export { EmailAuthProvider } from './src/main/ets/provider/EmailAuthProvider'
export { EmailUserBuilder } from './src/main/ets/entity/EmailUserBuilder'
export { PhoneAuthProvider } from './src/main/ets/provider/PhoneAuthProvider'
export { PhoneUserBuilder } from './src/main/ets/entity/PhoneUserBuilder'
export { VerifyCodeSettingBuilder } from './src/main/ets/entity/VerifyCodeSettingBuilder'
export type { AGConnectAuth } from './types/index.d'

const apiName = "auth";

export const creator = new InstanceMap((args: any[]) => {
    return new AGConnectAuthImpl(args[0]);
});

function main(container: ApiManager) {
    container.registerApiProvider(apiName, (args?: any[]) => creator.get(args));
}

main(agconnect as ApiManager);

export enum TokenState {
    SIGNED_IN, // 取得AGC授权,调用signIn取得授权
    TOKEN_UPDATED, // AGC Token更新
    TOKEN_INVALID, // AGC Token失效
    SIGNED_OUT // AGC注销
}

export enum VerifyCodeAction {
    REGISTER_LOGIN = 1001, // 登录/注册等
    RESET_PASSWORD = 1002  // 重置密码
}

export enum AGConnectAuthCredentialProvider {
    Phone_Provider = 11, // 手机
    Email_Provider = 12  // 邮箱
}

