export class StorageInstance<T> {
  private factory: (args?:any[]) => T;

  constructor(creator: (args?:any[]) => T) {
    this.factory = creator;
  }

  get(args?:any[]) {
    return this.factory(args);
  }
}
