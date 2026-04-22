---
description: onlyoffice中国版docker安装部署教程，包含镜像拉取、容器启动参数配置、example启动、访问验证等完整部署流程。
---

# 安装部署

## 拉取镜像

#### docker hub

```bash
docker pull moqisoft/documentserver:9.3.10
```

#### 国内免费第三方加速

**1️⃣ 毫秒镜像**
```bash
docker pull docker.1ms.run/moqisoft/documentserver:9.3.10
```
**2️⃣ dockerproxy**
```bash
docker pull dockerproxy.net/moqisoft/documentserver:9.3.10
```
如果使用第三方加速，需要将镜像名修改为正确的名称
```bash
docker tag docker.1ms.run/moqisoft/documentserver:9.3.10 moqisoft/documentserver:9.3.10
docker rmi docker.1ms.run/moqisoft/documentserver:9.3.10
```

如遇第三方加速不稳定，请关注第三方官方网站或交流群公告

## 启动编辑服务

```bash
docker run -itd \    
    --name ds-china \  
    -p 9000:80 \  # 编辑服务访问端口
    -p 9090:8000 \  # info 接口端口
    --restart=always \  
    --privileged \  # 高级版必须，某些情况下启动报错也需要传递该参数
    -e ALLOW_PRIVATE_IP_ADDRESS=true \  
    -e JWT_ENABLED=false \  
    -v 宿主机目录/Data:/var/www/onlyoffice/Data \  # 高级版必须，宿主机目录根据实际修改   
    -v 宿主机目录/App_Data:/var/www/onlyoffice/App_Data \  # 宿主机目录根据实际修改   
    -v /proc/cpuinfo:/host/proc/cpuinfo \  # 高级版必须，原样挂载，无需改动
    -v /sys/class:/host/sys/class \  # 高级版必须，原样挂载，无需改动
    moqisoft/documentserver:9.3.10  # 注意替换为实际镜像名
```

> [!IMPORTANT]
> - 建议使用 `Ubuntu` 或 `CentOS` 操作系统。    
> - 请确保宿主机默认有 `/proc/cpuinfo` 和 `/sys/class` 目录，否则机器码会变动。    
> - `MacOS` 系统不存在这些目录，无法稳定获取机器码。请不要作为宿主环境使用。

## 启动 example

```bash
docker exec ds-china sudo supervisorctl start ds:example
```

example 仅用于本地简单集成测试，生产环境建议关闭

## 访问系统

- 查看版本信息 http://ip:9090/info⁠
- 进入欢迎界面 http://ip:9000/welcome/

> [!IMPORTANT]
> 该 ip 不能为 `localhost` 或 `127.0.0.1`，否则会因为容器内访问不通，出现文档下载失败报错。

此时，你使用的中国版标准版即启动成功，可以与其他系统进行集成了。

中国版在保留了 onlyoffice 社区版的所有功能基础上，新增了部分使用功能，使用中遇到问题请优先搜索官网相关资料。

如果你还需要额外的功能，请阅读 [版本比较](../product/compare.md) 相关章节，选择通过授权升级到高级版本。
