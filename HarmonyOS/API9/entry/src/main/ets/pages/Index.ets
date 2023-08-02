import { StorageReference } from '@hw-agconnect/cloudstorage-ohos'
import { Logger } from "@hw-agconnect/base-ohos"
import agconnect from '@hw-agconnect/api-ohos'
import "@hw-agconnect/cloudstorage-ohos"

const TAG = "AGC_CLOUDSTORAGE_DEMO";

@Entry
@Component
struct Index {
  @State message: string = 'ShowResult'
  @State selected: string = '';
  @State currentPath: string = '';
  reference: StorageReference;

  build() {
    Row() {
      Column() {

        Text(this.message)
          .fontSize(20)
          .fontWeight(FontWeight.Normal)

        Button("init reference")
          .width('90%')
          .margin({ top: 20 })
          .onClick(async () => {
            try {
              this.reference = await agconnect.cloudStorage().storageReference();
              Logger.info(TAG, "cloudstorage init ok");
              this.message = "cloudstorage init ok";
            } catch (e) {
              Logger.info(TAG, "cloudstorage init failed" + e);
              this.message = "cloudstorage init failed" + e;
            }
          })

        Button("getList")
          .width('90%')
          .margin({ top: 10 })
          .onClick(async () => {
            Logger.info(TAG, "getList");
            let path = this.selected === '' ? this.currentPath : this.selected;
            const child = this.reference.child(path);
            child.list({ maxResults: 10 }).then((res) => {
              this.currentPath = path;
              this.selected = '';
              Logger.info(TAG, "getList success" + JSON.stringify(res));
              this.message = res.fileList[0].name().toString();
            }).catch(e => {
              Logger.info(TAG, "getList fail" + JSON.stringify(e));
              this.message = "getList fail" + JSON.stringify(e);
            })
          })

        Button("delete")
          .width('90%')
          .margin({ top: 10 })
          .onClick(async () => {
            const child = this.reference.child(this.message);
            child.delete().then((res) => {
              Logger.info(TAG, "delete success");
              this.message = "delete success";
            }).catch((err) => {
              Logger.info(TAG, "getList1 fail" + JSON.stringify(err));
              this.message = "getList1 fail" + JSON.stringify(err);
            });
          })
      }
      .width('100%')
    }
    .height('100%')
  }

}