# 安装部署

## 拉取镜像

#### docker hub
```bash
docker pull moqisoft/documentserver:latest
```

#### 阿里云
AMD64
```bash
docker pull crpi-jfv3ro7j3i1a1bjk.cn-shanghai.personal.cr.aliyuncs.com/moqisoft/documentserver:8.3.3-amd64
```

ARM64
```bash
docker pull crpi-jfv3ro7j3i1a1bjk.cn-shanghai.personal.cr.aliyuncs.com/moqisoft/documentserver:8.3.3-arm64
```

#### 百度网盘

https://pan.baidu.com/s/1nwCSvQrwdi8yrGik5A4MUQ?pwd=6666

> [!TIP]
> 如果因为网络等原因无法拉取，可加 QQ 群（183026419）获取离线版镜像        

## 启动编辑服务

```bash
docker run -itd \    
    --name ds-china \  
    -p 9000:80 \  
    -p 9090:8000 \  
    --restart=always \  
    --privileged \  # 高级版必
    -e ALLOW_PRIVATE_IP_ADDRESS=true \  
    -e JWT_ENABLED=false \  
    -v /host/path/to/Data:/var/www/onlyoffice/Data \  # 高级版必须   
    -v /host/path/to/App_Data:/var/www/onlyoffice/App_Data \  
    -v /host/path/to/sdkjs-plugins:/var/www/onlyoffice/documentserver/sdkjs-plugins \ 
    -v /proc/cpuinfo:/host/proc/cpuinfo \  # 高级版必须
    -v /sys/class:/host/sys/class \  # 高级版必须
    moqisoft/documentserver:latest
```

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

如果你还需要额外的功能，请阅读 [版本比较](../product/compare.md) 相关章节，选择合适的版本。
