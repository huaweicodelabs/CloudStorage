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

        let downloadFileButton = UIButton(frame: CGRect(x: 50, y: 250, width: 220, height: 50))
        downloadFileButton.backgroundColor = UIColor.blue
        downloadFileButton.setTitle("download File", for: .normal)
        downloadFileButton.addTarget(self, action: #selector(downloadFile), for: .touchUpInside)
        self.view.addSubview(downloadFileButton)

        let getFileMetadataButton = UIButton(frame: CGRect(x: 50, y: 320, width: 220, height: 50))
        getFileMetadataButton.backgroundColor = UIColor.blue
        getFileMetadataButton.setTitle("get File Metadata", for: .normal)
        getFileMetadataButton.addTarget(self, action: #selector(getFileMetadata), for: .touchUpInside)
        self.view.addSubview(getFileMetadataButton)
        
    }
    
    @objc func signInAnonymously() {
        AGCAuth.instance().signInAnonymously().onSuccess { (result) in
            self.resultLabel.text = "agc sign inanonymously success."
        }.onFailure { (error) in
            self.resultLabel.text = "agc sign inanonymously failed."
       }
    }

    @objc func downloadFile() {
        
        let storageReference = storage.reference(withPath: "test2.jpg")
        let dirPath = NSSearchPathForDirectoriesInDomains(FileManager.SearchPathDirectory.documentDirectory, FileManager.SearchPathDomainMask.userDomainMask, true).first;
        print(dirPath ?? "dirPath error")
        let filePath = dirPath!.appending("/test2.jpg")
        let task = storageReference.download(toFile: URL.init(fileURLWithPath: filePath))
        task?.onSuccess(callback: { (result) in
            self.resultLabel.text = "downloadFile success."
        }).onFailure(callback: { (error) in
            self.resultLabel.text = "downloadFile failed."
        })

    }
    
    @objc func getFileMetadata(_ sender: Any) {
        let storageReference = storage.reference(withPath: "test2.jpg")
        let task = storageReference.getMetadata()
        task.onSuccess(callback: { (result) in
            self.resultLabel.text = "getFileMetadata success"
        }).onFailure(callback: { (error) in
            self.resultLabel.text = "getFileMetadata failed"
        })
    }

}

