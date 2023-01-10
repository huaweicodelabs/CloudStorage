#附近消息演示-AGCCloudStorageJavaScriptSDK
##目录
*【导言】（#导言）
*【支持的环境】（支持的环境数量）
*【程序】（#程序）

##简介
本演示演示了使用SDK存储图片、视频、音频或其他用户生成的文件的示例。有关SDK的详细信息，请参见https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-Guides/agc-get-started。

入门
有关更多开发详细信息，请参阅以下链接：
开发指南：https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-Guides/agc-get-started
API参考：https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-References/cloudstroage

##操作步骤
1、激活云存储服务：默认不激活云存储服务。您需要在AGC中手动激活云存储服务。

2、新存储实例：打开云存储服务后，AGC会自动创建默认存储实例。如果您希望将应用系统数据和用户数据分开存储，您可以自行创建新的存储实例。

3.将项目设置> SDK代码片段中agconnectconfig对象中的所有属性复制到配置文件的agconnectconfig对象下的“agConnectConfig.js”中，并在“云存储”选项卡下添加“default_Storage”，设置默认存储实例。

4、集成SDK：如果您需要在应用客户端中使用云存储相关功能，则必须集成云存储客户端SDK。

5、初始化云存储：在应用客户端使用云存储之前，需要初始化云存储，并指定客户端使用的存储实例。

6、文件管理：应用客户端可以调用云存储SDK的API，进行上传文件、下载文件、删除文件、修改文件元数据等操作。

##支持的环境
建议使用Google Chrome 73及以上版本。

