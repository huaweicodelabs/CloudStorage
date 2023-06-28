export class AGCAuthErrorCode {
  static readonly NULL_TOKEN: AuthErrorCode = { code: 1, message: 'token is null.' };
  static readonly NOT_SIGN_IN: AuthErrorCode = { code: 2, message: 'no user signed in.' };
  static readonly USER_LINK_FAILED: AuthErrorCode = { code: 3, message: 'credential cannot be null or undefined.' };
  static readonly USER_UNLINK_FAILED: AuthErrorCode = { code: 4, message: 'provider cannot be null or undefined.' };
  static readonly ALREADY_SIGN_IN_USER: AuthErrorCode = { code: 5, message: 'already sign in a user ,please sign out at first.' };
  static readonly FAIL_TO_GET_ACCESS_TOKEN: AuthErrorCode = { code: 14, message: 'get user access token fail.' };
  static readonly FAIL_TO_DO_USER_REAUTH: AuthErrorCode = {code: 15, message: 'user reauthenticate fail'};
  static readonly FAIL_TO_UPDATE_EMAIL: AuthErrorCode = { code: 17, message: 'email or verify code can not be null or undefined.' };

  static readonly CREDENTIAL_INVALID: AuthErrorCode = { code: 24, message: 'credential is null.' };
  static readonly FAIL_TO_GET_CREDENTIAL_SERVICE: AuthErrorCode = { code: 11000, message: 'get agcCredential service failed.' };

}

export interface AuthErrorCode {
  code: number;
  message: string;
}