## 简介

AppGalleryConnect credential 提供对接AGC端侧网关的能力，SDK提供接口获取网关的认证凭据。

## 下载安装

```
ohpm install @hw-agconnect/credential-ohos
```

OpenHarmony ohpm 环境配置等更多内容，请参考[如何安装 OpenHarmony ohpm 包]

## 使用说明

```
import agconnect from "@hw-agconnect/api-ohos";
import "@hw-agconnect/core-ohos";
import "@hw-agconnect/credential-ohos";
```

##  需要权限

无

## 使用示例

### 初始化

1. 在您的项目中导入agc组件。

   ```
   import agconnect from '@hw-agconnect/api-ohos';
   import "@hw-agconnect/core-ohos";
   import "@hw-agconnect/credential-ohos";
   ```

2. 在您的应用初始化阶段使用context初始化SDK，推荐在MainAbility 的onCreate中进行。

    ```
   //初始化SDK
   onCreate(want, launchParam) {
     //务必保证resources/rawfile中包含agconnect-services.json文件
     agconnect.instance().init(this.context.getApplicationContext());
   }
   ```

### 获取网关Token

1. 在您的项目中导入agc组件。

   ```
   import agconnect from "@hw-agconnect/api-ohos";
   import "@hw-agconnect/core-ohos";
   import "@hw-agconnect/credential-ohos";
   ```

2. 调用接口，获取Token

   ```
   agconnect.credential().getToken()
   .then((token) => { //token })
   .catch((e) => {//error });
   ```

## 约束与限制

在下述版本验证通过： DevEco Studio: 3.1 Beta2(3.1.0.400), SDK: API9 Release(3.2.11.9)

## License

credential-ohos sdk is licensed under the: "ISC" 