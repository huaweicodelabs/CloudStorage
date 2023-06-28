# AGConnect 认证服务

## 简介

认证服务可以为您的应用快速构建安全可靠的用户认证系统，您只需在应用中访问认证服务的相关能力，而不需要关心云侧的设施和实现。

* 支持手机账号注册和登录。
* 支持邮箱账号注册和登录。

[Learn More](https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-Guides/agc-auth-introduction-0000001053732605)

## 下载安装

```
ohpm install @hw-agconnect/auth-ohos
```

OpenHarmony ohpm 环境配置等更多内容，请参考[如何安装 OpenHarmony ohpm 包]

## 使用说明

```
import agconnect from "@hw-agconnect/api-ohos";
import "@hw-agconnect/core-ohos";
import "@hw-agconnect/auth-ohos";
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
   import "@hw-agconnect/auth-ohos";
   ```

2. 在您的应用初始化阶段使用context初始化SDK，推荐在MainAbility 的onCreate中进行。

   ```
   //初始化SDK
   onCreate(want, launchParam) {
     //务必保证resources/rawfile中包含agconnect-services.json文件
     agconnect.instance().init(this.context.getApplicationContext());
   }
   ```

### 手机账号

1. 申请手机号码注册的验证码。

   调用[AGConnectAuth.requestPhoneVerifyCode](https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-References/openharmony-auth-agcauth-0000001340660285#section154023210148) 申请验证码。

   ```
   let verifyCodeSettings = new VerifyCodeSettingBuilder()
     .setAction(VerifyCodeAction.REGISTER_LOGIN)
     .setLang('zh_CN')
     .setSendInterval(60)
     .build();
   agconnect.auth().requestPhoneVerifyCode(countryCode,phoneNumber,verifyCodeSettings);
   ```

2. 使用手机号码注册用户。

   调用[PhoneUserBuilder](https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-References/openharmony-auth-phoneuser-0000001288100610)生成PhoneUser，然后调用[AGConnectAuth.createPhoneUser](https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-References/openharmony-auth-agcauth-0000001340660285#section11815319133)注册用户。注册成功后，系统会自动登录，无需再次调用登录接口。

   ```
   let user = new PhoneUserBuilder()
       .setCountryCode("countryCode")
       .setPhoneNumber("phoneNumber")
       .setPassword("password") //可以给用户设置初始密码。填写后后续可以用密码来登录
       .setVerifyCode('verifyCode')
       .build();
   auth.createPhoneUser(user).then(result => {// 创建用户成功});
   ```

3. 登录成功后可以调用[AGConnectAuth.getCurrentUser](https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-References/openharmony-auth-agcauth-0000001340660285#section87068861218)获取用户帐号数据。

   ```
   agconnect.auth().getCurrentUser();
   ```

### 邮箱账号

1. 在使用邮箱注册之前，需要先验证您的邮箱，确保该邮箱帐户归您所有。

   调用[AGConnectAuth.requestEmailVerifyCode](https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-References/openharmony-auth-agcauth-0000001340660285#section18901230101318)申请验证码。

   ```
   let verifyCodeSettings = new VerifyCodeSettingBuilder()
     .setAction(VerifyCodeAction.REGISTER_LOGIN)
     .setLang('zh_CN')
     .setSendInterval(60)
     .build();
   agconnect.auth().requestEmailVerifyCode('email',verifyCodeSettings);
   ```

2. 使用邮箱帐号注册用户。

   调用[EmailUserBuilder](https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-References/openharmony-auth-emailuser-0000001287940690)生成EmailUser，然后调用[AGConnectAuth.createEmailUser](https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-References/openharmony-auth-agcauth-0000001340660285#section20867736181218)注册用户。注册成功后，系统会自动登录，无需再次调用登录接口。

   ```
   let emailUser = new EmailUserBuilder()
     .setEmail("email")
     .setPassword("password") //可以给用户设置初始密码。填写后后续可以用密码来登录
     .setVerifyCode("verifyCode")
     .build();
   auth.createEmailUser(emailUser).then(result => {//创建帐号成功后，默认已登录})
   ```

3. 登录成功后可以调用[AGConnectAuth.getCurrentUser](https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-References/openharmony-auth-agcauth-0000001340660285#section87068861218)获取用户帐号数据。

   ```
   agconnect.auth().getCurrentUser();
   ```

## 约束与限制

在下述版本验证通过： DevEco Studio: 3.1 Beta2(3.1.0.400), SDK: API9 Release(3.2.11.9)

## License

auth-ohos sdk is licensed under the: "ISC" 