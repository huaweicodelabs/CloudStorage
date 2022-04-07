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



    public void getFileList(View view) {
        if (mAGCStorageManagement == null) {
            initAGCStorageManagement();
        }
        getFileList();
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



    private void getFileList() {
        final String path = "test.jpg";
        StorageReference storageReference = mAGCStorageManagement.getStorageReference(path);
        Task<ListResult> listResultTask = null;
        listResultTask = storageReference.list(100);
        try {
            listResultTask.addOnSuccessListener(listResult -> mShowResultTv.setText("getfilelist success!"))
                    .addOnFailureListener(e -> mShowResultTv.setText("getfilelist failure!"));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
}
