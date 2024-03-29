# NearbyMessageDemo-AGCCloudStorage
## Contents
 * [Introduction](#introduction)
 * [Supported Environments](#supported-environments)
 * [Procedure](#procedure)

## Introduction
This demo demonstrates an example of using the SDK to store pictures, videos, audio, or other user-generated files. For details about the SDK, please refer to https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-Guides/agc-get-started.

Getting Started
For more development details, please refer to the following link:
Development Guide: https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-Guides/agc-get-started
API References: https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-References/cloudstroage

## Procedure
1. Activate cloud storage service: The cloud storage service is not activated by default. You need to manually activate the cloud storage service in AGC.

2. New storage instance: After opening the cloud storage service, AGC will automatically create a default storage instance. If you want to store application system data and user data separately, you can create a new storage instance yourself.

3. Integrated SDK: If you need to use cloud storage-related functions in the application client, you must integrate the cloud storage client SDK.

4. Initialize the cloud storage: Before the application client uses the cloud storage, you need to initialize the cloud storage and specify the storage instance used by the client.

5. File management: The application client can call the API of the cloud storage SDK to perform operations such as uploading files, downloading files, deleting files, and modifying file metadata.

## Supported Environments
Android Studio 3.0 or a later version is recommended.


