import { AGConnectDefaultUser } from "../user/AGConnectDefaultUser";
import { StoredUserInfo } from "./StoredUserInfo";
import { AegisAesManager, FileStorage, Logger } from '@hw-agconnect/base-ohos'
import agconnect from "@hw-agconnect/api-ohos";

const TAG: string = "StoredUserManager";
export class StoredUserManager {
  private static maps = new Map<string, StoredUserManager>();

  private FILE_PATH: string = "agconnect";
  private DEFAULT_FILE_NAME = "auth_aegis";
  private name: string;
  private storedUserInfo: StoredUserInfo | null = null;

  static getInstance(name: string): StoredUserManager {
    let manager = undefined;
    if (StoredUserManager.maps.has(name)) {
      manager = StoredUserManager.maps.get(name);
    }
    if (manager == undefined) {
      manager = new StoredUserManager(name);
      this.maps.set(name, manager);
    }
    return manager;
  }

  private constructor(name: string) {
    this.name = name;
    Logger.info(TAG, "constructor, name is " + name);
  }

  async getStoredUser(): Promise<StoredUserInfo | null> {
    // 避免反复读取
    if (this.storedUserInfo) {
      return Promise.resolve(this.storedUserInfo);
    }

    let userString = await this.loadFromStorage();
    if (userString == '' || userString == null) {
      Logger.info(TAG, "getStoredUser user is null");
      this.storedUserInfo = null;
    } else {
      let user = JSON.parse(userString);
      this.storedUserInfo = new StoredUserInfo(this.name);
      this.storedUserInfo.constructUser(user);
    }
    return Promise.resolve(this.storedUserInfo);
  }

  public async updateStoredUser(defaultUser: AGConnectDefaultUser | null): Promise<void> {
    if (defaultUser) {
      await this.updateUserInfo(defaultUser.getUser());
    } else {
      await this.updateUserInfo(null);
    }
  }

  public async updateUserInfo(storedUserInfo: StoredUserInfo | null): Promise<StoredUserInfo | null> {
    this.storedUserInfo = storedUserInfo;
    await this.saveToStorage(this.storedUserInfo);
    return Promise.resolve(this.storedUserInfo);
  }

  private async saveToStorage(storedUserInfo: StoredUserInfo | null): Promise<void> {
    let context = agconnect.instance().getContext();
    let fileName = this.DEFAULT_FILE_NAME + "_" + this.name;
    if (storedUserInfo == null) {
      Logger.info(TAG, "clear storage user");
      await FileStorage.write(context, this.FILE_PATH, fileName, '');
      return Promise.resolve();
    }
    let userString: string = JSON.stringify(storedUserInfo);
    let crypto = await AegisAesManager.getInstance().getDefaultAesCrypto();
    await FileStorage.write(context, this.FILE_PATH, fileName, userString, crypto);
    return Promise.resolve();
  }

  private async loadFromStorage(): Promise<string | null> {
    let context = agconnect.instance().getContext();
    let fileName = this.DEFAULT_FILE_NAME + "_" + this.name;
    let crypto = await AegisAesManager.getInstance().getDefaultAesCrypto();
    let result = await FileStorage.read(context, this.FILE_PATH, fileName, crypto);
    return Promise.resolve(result);
  }


}