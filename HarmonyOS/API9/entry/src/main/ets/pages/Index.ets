import { PhoneAuthProvider } from '@hw-agconnect/auth-ohos'
import { StorageReference } from '@hw-agconnect/cloudstorage-ohos'
import { Logger } from "@hw-agconnect/base-ohos"
import agconnect from '@hw-agconnect/api-ohos';
import "@hw-agconnect/cloudstorage-ohos"
import "@hw-agconnect/auth-ohos";

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

        /*Button("login")
          .width('90%')
          .margin({ top: 10 })
          .onClick(async () => {
            try {
              let user = await agconnect.auth().getCurrentUser();
              if (!user) {
                //如果需要用户登录，151xxxxx888需要修改为开发者在AGC中注册的手机号
                let credential = PhoneAuthProvider.credentialWithPassword("86", "151xxxxx888", "hw123456");
                agconnect.auth().signIn(credential).then(signInResult => {
                  Logger.info(TAG, "signInPhone success " + signInResult.getUser().getUid());
                  this.message = "signInPhone success" + signInResult.getUser().getUid();
                }).catch(error => {
                  Logger.error(TAG, "signInPhone error " + JSON.stringify(error));
                  this.message = "signInPhone error " + JSON.stringify(error);
                })
              } else {
                Logger.info(TAG, "user already login " + user.getUid());
                this.message = "user already login " + user.getUid();
              }
            } catch (e) {
              Logger.info(TAG, "signInPhone failed" + e);
              this.message = "signInPhone failed " + e;
            }
          })*/

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
            const child = this.reference.child('123.txt');
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