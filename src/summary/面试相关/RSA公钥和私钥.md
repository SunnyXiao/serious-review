<!--
 * @Author: your name
 * @Date: 2020-05-21 17:26:01
 * @LastEditTime: 2020-05-21 17:33:11
 * @LastEditors: Please set LastEditors
 * @Description: 原文来自https://www.imqianduan.com/server/RSA-public-private.html
 * @FilePath: \serious-review\src\summary\面试相关\密钥生成.md
 -->

### Windows 下使用OpenSSL生成RSA公钥和私钥

1. 下载OpenSSL

可到该地址下载OpenSSL:
https://oomake.com/download/openssl

下载OpenSSL后，按照提示安装OpenSSL。

2. 打开OpenSSL文件夹下的bin目录，点击openssl.exe,打开命令窗口

3. 开始生成RSA的私钥
输入命令:genrsa -out rsa_private_key.pem 1024

> genrsa -out rsa_private_key.pem 1024

此时在OpenSSL的bin目录下生成了一个rsa_private_key.pem,这就是最初的私钥文件
但是这不是我们最终要用的私钥文件，我们最终使用的私钥文件必须是要经过PKCS#8编码这个后面步骤会给出。


4. 利用私钥文件生成RSA公钥文件

输入命令:rsa -in rsa_private_key.pem -pubout -out rsa_public_key.pem

> rsa -in rsa_private_key.pem -pubout -out rsa_public_key.pem

此时在OpenSSL的bin目录下会生成rsa_public_key.pem文件,这就是公钥文件。

5. 前面说过我们最终使用的RSA文件是需要经过PKCS#8编码的,之前生成的RSA文件只是用来生成公钥文件的。

接下来就要对之前的私钥文件进行PKCS#8编码，生成一个编码后的私钥文件。

输入命令:pkcs8 -topk8 -inform PEM -in rsa_private_key.pem -outform PEM -out pkcs8_rsa_private_key.pem –nocrypt

> pkcs8 -topk8 -inform PEM -in rsa_private_key.pem -outform PEM -out pkcs8_rsa_private_key.pem –nocrypt

这个时候在OpenSSL目录的bin目录下又会生成一个pkcs8_rsa_private_key.pem文件，这个就是我们最终要用的私钥文件。