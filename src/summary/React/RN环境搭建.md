# React-Native环境搭建(windows) #

从零开始撸 React-native

## 开始 ##
首先，我们需要知道都需要哪些东西

- Node（版本必须高于8.3。）
- Python2.x版本必须为 2.x（不支持 3.x）
- Java JDK 1.8（目前不支持 1.9 及更高版本）
- Android Studio
- react-native-cli


[Node官网下载传送门](https://nodejs.org/en/) 

[Python官网下载传送门](https://www.python.org/downloads/windows/)

`Python` 的安装基本可以使用软件给定的设置，一直点下一步就可以了，只有在这个地方
![image](https://github.com/SunnyXiao/serious-review/blob/master/src/summary/React/imgs/Python.png)

注意点 `x` 的我们需要将它更改为第一个选项，这样我们就不需要后期手动去将它添加到环境变量了

### Java JDK ###

[下载地址](https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)

![image](https://raw.githubusercontent.com/ltadpoles/web-document/master/React/images/Java-JDK.png)

`Java JDK `环境变量配置：

1. 点击 `系统变量` 下面的 `新建` 选项,在 `变量名` 处填上 `Java_Home`, `变量值` 为 `JDK` 安装路径，我自己的路径是 `C:\Program Files\Java\jdk1.8.0_211` ,点击 `确定` 选项;
1. 在 `系统变量` 中找到 `Path` ,选中 `Path`点击 `新增`,将 `%Java_Home%\bin;%Java_Home%\jre\bin;` 添加进去，点击 `确定` 选项(这里 `win7` 和 `win10` 会有一点小差异)
2. 在 `系统变量` 栏，`新建`，`变量名` 为 `CLASSPATH` ，`变量值` 为 `.;%Java_Home%\bin;%Java_Home%\lib\dt.jar;%Java_Home%\lib\tools.jar`，`确定`
4. 点击 `环境变量` 最下面的 `确定` 选项
5. 打开命令窗口，输入 `java` 或者 `java -version`，成功输出，则表示配置成功

### Android 开发环境

关于 `Android` 开发环境的配置，这一部分在 `RN` 官网上面有详细的介绍，可以关注 [这里](https://reactnative.cn/docs/getting-started/)


### 创建新项目 ###

下载 react-native-cli 

```
npm install -g react-native-cli
```

创建新项目

```
react-native init RnDemo
```


这样，我们的一个 `RN` 项目就创建完成了，现在就需要进行真机或者模拟器的调试了。不要慌，官网也给了我们详细的教程，[传送门](https://reactnative.cn/docs/getting-started/)


### 运行

一切前期工作准备妥当，这个时候，我们只需要在命令行输入下面命令，就可以看到我们的项目了，美滋滋

```
cd RnDemo

react-native run-android
```