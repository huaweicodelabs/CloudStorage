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

import com.huawei.agconnect.server.commons.exception.AGCException;

import java.util.Scanner;

/**
 * demo
 *
 * @since 2021-07-03
 */
public class Demo {
    public static void main(String[] args) throws AGCException {
        userInput();
        System.exit(1);
    }

    public static void userInput() {
        int num = 0;
        do {
            Scanner scan = new Scanner(System.in);

            System.out.println("1.initializeAuth (init first)");
            System.out.println("2.uploadFile");
            System.out.println("3.listObjects");
            System.out.println("4.downloadFile");
            System.out.println("5.getMetadata");
            System.out.println("6.updateMetadata");
            System.out.println("7.deleteFile");
            System.out.println("Choose an operation (enter 0 to exit):");
            num = scan.nextInt();

            try {
                switch (num) {
                    case 1:
                        ServerApi.initializeAuth();
                        break;
                    case 2:
                        ServerApi.uploadFile();
                        break;
                    case 3:
                        ServerApi.listObjects();
                        break;
                    case 4:
                        ServerApi.downloadFile();
                        break;
                    case 5:
                        ServerApi.getMetadata();
                        break;
                    case 6:
                        ServerApi.updateMetadata();
                        break;
                    case 7:
                        ServerApi.deleteFile();
                        break;
                    case 0:
                        System.out.println("Exit demo");
                        break;
                    default:
                        System.out.println("Please enter 1-7.");
                }
            } catch (Exception e) {
                System.out.println(e.getMessage());
            }
        } while (num != 0);
    }
}
