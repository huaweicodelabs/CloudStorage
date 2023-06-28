# AGConnect 云存储

##  简介

AppGallery Connect（简称AGC）云存储是一种可伸缩、免维护的云端存储服务，可用于存储图片、音频、视频或其他由用户生成的内容。借助云存储服务，您可以无需关心存储服务器的开发、部署、运维、扩容等事务，大大降低了应用使用存储的门槛，让您可以专注于应用的业务能力构建，助力您的商业成功。

云存储提供了客户端和服务端SDK，您可以使用云存储SDK为您的应用实现安全可靠的文件上传和下载服务，同时具备如下优势。

* 安全可靠：全流程使用HTTPS协议对用户的传输数据进行加密保护，并采用安全的加密协议将文件加密存储在云端。
* 断点续传：因网络原因或用户原因导致的操作中止，只需要简单地传入操作中止的位置，就可以尝试重新开始该操作。
* 可伸缩：提供EB级的数据存储，解决海量数据存储的难题。
* 易维护：通过简单的判断返回异常就可以定位出错误原因，定位快捷方便。
  [Learn More](https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-Guides/agc-cloudstorage-introduction-0000001054847259)

## 下载安装

```
ohpm install @hw-agconnect/cloudstorage-ohos
```

OpenHarmony ohpm 环境配置等更多内容，请参考[如何安装 OpenHarmony ohpm 包](https://gitee.com/openharmony-tpc/docs/blob/master/OpenHarmony_har_usage.md)

##  使用说明

```
import agconnect from "@hw-agconnect/api-ohos";
import "@hw-agconnect/core-ohos";
import "@hw-agconnect/cloudstorage-ohos";
```

##  需要权限

```
ohos.permission.INTERNET
```

## 使用示例

### 初始化

1. 在您的项目中导入agc组件。

   ```
   import agconnect from '@hw-agconnect/api-ohos';
   import "@hw-agconnect/core-ohos";
   import "@hw-agconnect/cloudstorage-ohos";
   ```

2. 在您的应用初始化阶段使用context初始化SDK，推荐在MainAbility 的onCreate中进行。

    ```
   //初始化SDK
   onCreate(want, launchParam) {
     //务必保证resources/rawfile中包含agconnect-services.json文件
     agconnect.instance().init(this.context.getApplicationContext());
   }
   ```

3. 调用agconnect.cloudStorage初始化一个默认存储实例的StorageManagement对象。

    ```
    const storageManagement = agconnect.cloudStorage();
    ```

### 上传文件
您可以通过引用操作本地设备上的文件，将文件上传到云端的存储实例中。

1. 调用StorageManagement.storageReference方法创建待上传文件的引用，将本地文件传入到预先规划的云端地址中。

   ```
   var storageReference = storage.storageReference();
   var reference = storageReference.child('images/demo.jpg');
   ```

2. 调用StorageReference.putData将文件上传到存储实例中。

   ```
   var data = new Uint8Array(len);
   ......
   var uploadTask = reference.putData(data);
   ```
   
3. 文件在正常上传过程中，可通过调用UploadTask类的catch、on方法处理上传任务中的事件。

   ```
   uploadTask.on('progress', (uploadSize, totalSize) =>{ 
    var progress = (uploadSize / totalSize) * 100
   });
   uploadTask.catch();
   ```
   
### 列举文件
列举文件是指获取某个目录下的所有文件和目录信息，云存储SDK支持通过API列举云端某个目录下的所有文件或子目录。

1. 在列举某个目录下的文件或目录前，先调用StorageManagement.storageReference创建目录的引用。例如创建根目录的引用
   ```
    var storageReference = storage.storageReference();
    reference.listAll()
    .then((res) => {})
    .catch((err) => {});
   ```

2. 如果需要分页获取，可以调用StorageReference.list(options?: ListOptions)方法。

   ```
    reference.list({maxResults:100, pageMarker:pageMarker})
    .then((res)=>{})
    .catch((err) => {});
   ```
   
### 获取文件的下载地址
文件上传到云端后，您可以通过云存储SDK获取云端文件的下载地址。

1. 调用StorageManagement.storageReference创建需要下载文件的引用。
   ```
    var storageReference = storage.storageReference();
    var reference = storageReference.child('images/demo.jpg');
   ```

2. 调用StorageReference.getDownloadURL获取下载地址。

   ```
   reference.getDownloadURL().then(function(downloadURL){}).catch((err) => {});
   ```
   
3. 您可以将获取的下载地址拷贝到浏览器的导航窗口体验文件的下载。


##  约束与限制

在下述版本验证通过： DevEco Studio: 3.1 Beta2(3.1.0.400), SDK: API9 Release(3.2.11.9)

## License

cloudstorage-ohos sdk is licensed under the: "ISC" 