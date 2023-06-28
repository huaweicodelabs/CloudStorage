import { AGConnectAuth } from "@hw-agconnect/auth-ohos"
import { StorageReference } from '@hw-agconnect/cloudstorage-ohos'
import { Logger } from "@hw-agconnect/base-ohos"

let agconnect = globalThis.agconnect;
//let auth: AGConnectAuth = agconnect.auth();

const TAG = "AGC_CLOUDSTORAGE_DEMO";


function stringToUint8Array(str){
  var arr = [];
  for (var i = 0, j = str.length; i < j; ++i) {
    arr.push(str.charCodeAt(i));
  }

  var tmpUint8Array = new Uint8Array(arr);
  return tmpUint8Array
}

@Entry
@Component
struct Index {
  @State message: string = 'ShowResult'
  reference: StorageReference;

  build() {
    Row() {
      Column() {

        Text(this.message)
          .fontSize(20)
          .fontWeight(FontWeight.Normal)

        Button("Get File")
          .fontSize(20)
          .fontWeight(FontWeight.Bold)
          .width('90%')
          .height(55)
          .margin({ top: 20 })
          .onClick(async () => {
            const child = this.reference.child('path');
            child.list({ maxResults: 10 }).then((res) => {
              Logger.info(TAG, "getList1 success" + JSON.stringify(res));
            }).catch(e => {
              Logger.info(TAG, "getList1 fail" + JSON.stringify(e));
            })
          })

        Button("Delete File")
          .fontSize(20)
          .fontWeight(FontWeight.Bold)
          .width('90%')
          .height(55)
          .margin({ top: 20 })
          .onClick(async () => {
            var reference = this.reference.child('123.txt');
            reference.delete()
              .then((res) => {})
              .catch((err) => {});
          })

      }
      .width('100%')
    }
    .height('100%')
  }
}