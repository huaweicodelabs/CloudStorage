/*
 * Copyright 2020. Huawei Technologies Co., Ltd. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const {AGCClient, CredentialParser} = require('@agconnect/common-server');
const {StorageManagement} = require('@agconnect/cloudstorage-server');
const fs = require('fs');

const credential = CredentialParser.toCredential('[PATH]/agc-apiclient-xxx-xxx.json');
AGCClient.initialize(credential);

let bucketName = '';

uploadFile();
function uploadFile() {
  const storage = new StorageManagement();
  const bucket = storage.bucket(bucketName);

  bucket.upload('./test.txt')
    .then(res => console.log(res))
    .catch(err => console.log(err));
}

// downloadFile();
function downloadFile() {
  const storage = new StorageManagement();
  const bucket = storage.bucket(bucketName);
  const remoteFile = bucket.file('test.txt');
  const localFile = './test.txt';

  remoteFile.createReadStream()
    .on('error', err => {
    })
    .on('end', () => {
    })
    .pipe(fs.createWriteStream(localFile))
}

// getFileMetadata();
function getFileMetadata() {
  const storage = new StorageManagement();
  const bucket = storage.bucket(bucketName);
  const file = bucket.file('test.txt');
  file.getMetadata().then(res => {
    console.log(res);
  }).catch(err => {
    console.log(err);
  })
}

// updateFileMetadata();
function updateFileMetadata() {
  const storage = new StorageManagement();
  const bucket = storage.bucket(bucketName);
  const file = bucket.file('test.txt');

  const metadata = {
    contentLanguage: 'en-US',
    customMetadata: {
      test: 'test'
    }
  };

  file.setMetadata(metadata).then(res => {
    console.log(res);
  }).catch(err => {
    console.log(err);
  })
}

// getFileList();
function getFileList() {
  const storage = new StorageManagement();
  const bucket = storage.bucket(bucketName);

  bucket.getFiles({delimiter: '/'}).then(res => {
    console.log(res)
  }).catch(err => {
    console.log(err);
  })
}

// deleteFile();
function deleteFile() {
  const storage = new StorageManagement();
  const bucket = storage.bucket(bucketName);
  const file = bucket.file('test.txt');
  file.delete().then(res => {
  }).catch(err => {
  })
}
