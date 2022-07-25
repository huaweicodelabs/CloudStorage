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

import UIKit
import AGConnectAuth
import AGConnectStorage

class ViewController: UIViewController {
    
    var storage = AGCStorage.getInstanceForBucketName("codelab-test-wne6b")

    let resultLabel = UILabel(frame: CGRect(x: 60, y: 150, width: 300, height: 60))

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.
        
        let signInButton = UIButton(frame: CGRect(x: 50, y: 80, width: 220, height: 50))
        signInButton.backgroundColor = UIColor.blue
        signInButton.setTitle("Sign In", for: .normal)
        signInButton.addTarget(self, action: #selector(signInAnonymously), for: .touchUpInside)
        self.view.addSubview(signInButton)

        resultLabel.textColor = UIColor.darkGray
        self.view.addSubview(resultLabel)

        let uploadFileButton = UIButton(frame: CGRect(x: 50, y: 250, width: 220, height: 50))
        uploadFileButton.backgroundColor = UIColor.blue
        uploadFileButton.setTitle("Upload File", for: .normal)
        uploadFileButton.addTarget(self, action: #selector(uploadFile), for: .touchUpInside)
        self.view.addSubview(uploadFileButton)

        let deleteFileButton = UIButton(frame: CGRect(x: 50, y: 320, width: 220, height: 50))
        deleteFileButton.backgroundColor = UIColor.blue
        deleteFileButton.setTitle("Delete File", for: .normal)
        deleteFileButton.addTarget(self, action: #selector(deleteFile), for: .touchUpInside)
        self.view.addSubview(deleteFileButton)
        
    }
    
    @objc func signInAnonymously() {
        AGCAuth.instance().signInAnonymously().onSuccess { (result) in
            self.resultLabel.text = "agc sign inanonymously success."
        }.onFailure { (error) in
            self.resultLabel.text = "agc sign inanonymously failed."
       }
    }

    @objc func uploadFile() {
        
        let storageReference = storage.reference(withPath: "test1.jpg")
        let dirPath = NSSearchPathForDirectoriesInDomains(FileManager.SearchPathDirectory.documentDirectory, FileManager.SearchPathDomainMask.userDomainMask, true).first;
        print(dirPath ?? "dirPath error")
        let filePath = dirPath!.appending("/test1.jpg")
        let task = storageReference.uploadFile(URL.init(fileURLWithPath: filePath))
        task?.onSuccess(callback: { (result) in
            self.resultLabel.text = "uploadFile success."
        }).onFailure(callback: { (error) in
            self.resultLabel.text = "uploadFile failed."
        })

    }
    
    @objc func deleteFile() {
        
        let storageReference = storage.reference(withPath: "test1.jpg")
        let task = storageReference.deleteFile()
        task.onSuccess(callback: { (result) in
            self.resultLabel.text = "deleteFile success."
        }).onFailure(callback: { (error) in
            self.resultLabel.text = "deleteFile failed."
        })

    }

}

