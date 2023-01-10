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
package com.huawei.agconnect.cloud.storage.demo;

import android.Manifest;
import android.os.Bundle;
import android.os.Environment;
import android.support.v4.app.ActivityCompat;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.TextView;

import com.huawei.agconnect.AGConnectInstance;
import com.huawei.agconnect.auth.AGConnectAuth;
import com.huawei.agconnect.cloud.storage.core.AGCStorageManagement;
import com.huawei.agconnect.cloud.storage.core.DownloadTask;
import com.huawei.agconnect.cloud.storage.core.FileMetadata;
import com.huawei.agconnect.cloud.storage.core.ListResult;
import com.huawei.agconnect.cloud.storage.core.StorageReference;
import com.huawei.agconnect.cloud.storage.core.UploadTask;
import com.huawei.hmf.tasks.Task;

import java.io.File;

public class MainActivity extends AppCompatActivity {
    private AGCStorageManagement mAGCStorageManagement;
    private TextView mShowResultTv;
    private String[] permissions = {
            Manifest.permission.WRITE_EXTERNAL_STORAGE,
            Manifest.permission.READ_EXTERNAL_STORAGE,
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        mShowResultTv = findViewById(R.id.showResult);
        AGConnectInstance.initialize(getApplicationContext());
        login();
        ActivityCompat.requestPermissions(this, permissions, 1);
    }

    private void initAGCStorageManagement() {
        mAGCStorageManagement = AGCStorageManagement.getInstance();
    }

    private void login() {
        if (AGConnectAuth.getInstance().getCurrentUser() != null) {
            System.out.println("already sign a user");
            return;
        }
        AGConnectAuth.getInstance().signInAnonymously().addOnSuccessListener(signInResult -> System.out.println("AGConnect OnSuccess"))
                .addOnFailureListener(e -> System.out.println("AGConnect OnFail: " + e.getMessage()));
    }

    public void uploadFile(View view) {
        if (mAGCStorageManagement == null) {
            initAGCStorageManagement();
        }
        uploadFile();
    }



    public void deleteFile(View view) {
        if (mAGCStorageManagement == null) {
            initAGCStorageManagement();
        }
        deleteFile();
    }

    private void deleteFile() {
        final String path = "test.jpg";
        System.out.println(String.format("path=%s", path));
        StorageReference storageReference = mAGCStorageManagement.getStorageReference(path);
        Task<Void> deleteTask = storageReference.delete();
        try {
            deleteTask.addOnSuccessListener(aVoid -> mShowResultTv.setText("delete success!"))
                    .addOnFailureListener(e -> mShowResultTv.setText("delete failure!"));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void uploadFile() {
        final String path = "test.jpg";
        String fileName = "test.jpg";
        String agcSdkDirPath = getAGCSdkDirPath();
        final File file = new File(agcSdkDirPath, fileName);
        if (!file.exists()) {
            mShowResultTv.setText("file is not exist!");
            return;
        }
        StorageReference storageReference = mAGCStorageManagement.getStorageReference(path);
        UploadTask uploadTask = storageReference.putFile(file);
        try {
            uploadTask.addOnSuccessListener(uploadResult -> mShowResultTv.setText("upload success!"))
                    .addOnFailureListener(e -> mShowResultTv.setText("upload failure!"));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    private void getFileMetadata() {
        final String path = "test.jpg";
        StorageReference storageReference = mAGCStorageManagement.getStorageReference(path);
        Task<FileMetadata> fileMetadataTask = storageReference.getFileMetadata();
        try {
            fileMetadataTask.addOnSuccessListener(metadata -> mShowResultTv.setText("getfilemetadata success!"))
                    .addOnFailureListener(e -> mShowResultTv.setText("getfilemetadata failure!"));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }



    private String getAGCSdkDirPath() {
        String path = Environment.getExternalStorageDirectory().getAbsolutePath() + "/AGCSdk/";
        System.out.println("path=" + path);
        File dir = new File(path);
        if (!dir.exists()) {
            dir.mkdirs();
        }
        return path;
    }
}
