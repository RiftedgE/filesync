# 文件/文件同步工具

## *by NoRain*

## 2023/12/24

为了解决多端同步的痛点,决定本地开启一个服务器.

### 使用方式

注意:基于node版本14.21.3,版本太低可能会导致报错.

初始化：

- 执行```npm install```初始化
- 执行```npm run build```构建
- 执行```npm run copy```复制网页和图标到对应位置

打包：

- 执行```npm run exec```打包成.exe可执行文件，然后双击打开即可
- 如果觉得图标难看，可以下载rcedit等软件修改。

运行：

- 执行```npm run start```开启服务器
- 根据运行窗口，网页输入 HttpServer 后面的IP地址。

可能的错误:

- 数据库安装失败,多执行```npm install```几次试试.
- 第一次运行提示乱七八糟的,能运行就别管.

### version

|版本|说明|
|---|---|
|1.0.0|初版|
|1.1.0|修复重复上传文字bug，添加文件大小提示|
|1.2.0|添加夜间模式|
|1.3.0|添加当前页面二维码|
|1.4.0|打包成exe|
|1.5.0|添加端口动态切换，防止端口被占用|
|1.6.0|修复打包之后无法下载文件的BUG|
|1.7.0|打开启动服务器之后默认浏览器，并且开发服务器配置|

运行截图:

![screenshot](screenshot.png)

**如果你喜欢这个项目，可以请我喝杯奶茶：**

![joke](joke.png)
