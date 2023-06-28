# AGConnect Core 

## 简介

AppGalleryConnect Core 是AGC业务的基础核心SDK，提供以下能力：

* 提供AGC 上层业务SDK(比如认证服务、云存储等)初始化
* 提供读取agconnect-services.json配置文件的接口
* 提供AAID获取接口

[Learn More](https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-Guides/agc-get-started-harmony-ts-0000001534932433)

## 下载安装

```
ohpm install @hw-agconnect/core-ohos
```

OpenHarmony ohpm 环境配置等更多内容，请参考[**如何安装** OpenHarmony ohpm 包]

## 使用说明

```
import agconnect from "@hw-agconnect/api-ohos";
import "@hw-agconnect/core-ohos";
```

##  需要权限

无

## 使用示例

### 初始化

1. 在您的项目中导入agc组件。

   ```
   import agconnect from '@hw-agconnect/api-ohos';
   import "@hw-agconnect/core-ohos";
   ```

2. 在您的应用初始化阶段使用context初始化SDK，推荐在MainAbility 的onCreate中进行。

   ```
   //初始化SDK
   onCreate(want, launchParam) {
     //务必保证resources/rawfile中包含agconnect-services.json文件
     agconnect.instance().init(this.context.getApplicationContext());
   }
   ```

###  获取agconnect-services.json配置文件内容

   SDK完成初始化后，可以调用接口获取agconnect-services.json文件的内容（agconnect-services.json中部分内容为加密存储，通过SDK获取到的结果为最终解密后的结果）。
   ```
   let config = await agconnect.instance().getConfig();
   let client_id = await config.getString("/client/client_id");
   
   ```

### 获取AAID

   SDK完成初始化后，获取AAID
   ```
   import agconnect from "@hw-agconnect/api-ohos";
   
   let aaid = await agconnect.aaid().getAaid()
   ```

## 约束与限制

在下述版本验证通过： DevEco Studio: 3.1 Beta2(3.1.0.400), SDK: API9 Release(3.2.11.9)

## License

core-ohos sdk is licensed under the: "ISC" 