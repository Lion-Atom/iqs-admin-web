# ELADMIN-WEB

ELADMIN 前端源码

#### 项目源码

|     |   后端源码  |   前端源码  |
|---  |--- | --- |
|  github   |  https://github.com/elunez/eladmin   |  https://github.com/elunez/eladmin-web   |
|  码云   |  https://gitee.com/elunez/eladmin   |  https://gitee.com/elunez/eladmin-web   |

#### 开发文档
[https://el-admin.vip](https://el-admin.vip)

#### 前端模板

初始模板基于： [https://github.com/PanJiaChen/vue-element-admin](https://github.com/PanJiaChen/vue-element-admin)

模板文档： [https://panjiachen.github.io/vue-element-admin-site/zh/guide/](https://panjiachen.github.io/vue-element-admin-site/zh/guide/)

#### Build Setup
``` bash
# 配置镜像加速
https://www.ydyno.com/archives/1219.html

# 安装依赖
npm install

# 启动服务 localhost:8013
npm run dev

# 构建生产环境
npm run build:prod
```

#### 常见问题

1、linux 系统在安装依赖的时候会出现 node-sass 无法安装的问题

解决方案：
```
1. 单独安装：npm install --unsafe-perm node-sass 
2. 直接使用：npm install --unsafe-perm
```

2、加速node-sass安装

https://www.ydyno.com/archives/1219.html

#### GIT发布远程分支

Git如何把本地代码推送到远程仓库 git init // 初始化版本库

git add . // 添加文件到版本库（只是添加到缓存区），.代表添加文件夹下所有文件

git commit -m "first commit" // 把添加的文件提交到版本库，并填写提交备注

到目前为止，我们完成了代码库的初始化，但代码是在本地，还没有提交到远程服务器，所以关键的来了，要提交到就远程代码服务器，进行以下两步：

git remote add origin 你的远程库地址 // 把本地库与远程库关联

git push -u origin master // 第一次推送时

git push origin master // 第一次推送后，直接使用该命令即可推送修改

#### 反馈交流

- QQ交流群：一群：<strike>891137268</strike> 已满、二群：947578238