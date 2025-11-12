# 子目录部署（开发中）

原社区版并没有完全支持子目录部署，比如你需要将 `documentserver` 部署在 `/editor` 路径下，单纯使用 `nginx` 转发会发现部分接口依然不带 `/editor`。这会导致不能完整的部署在子目录下。

中国版源码级别支持子目录部署，开启也非常方便。

## 启动容器传递环境变量 

启动容器传递 `BASE_PATH` 环境变量

```bash
docker run -itd \    
    --name ds-china \  
    -p 9000:80 \  
    -p 9090:8000 \  
    --restart=always \  
    --privileged \  # 高级版必
    -e BASE_PATH=/editor # 子目录
    # ... 其他参数
    moqisoft/documentserver:9.1.01-amd64
```


## 配置转发

配置 nginx 转发

```bash

# 注意有 / 结尾
location ^~ /editor/ {
    proxy_pass http://127.0.0.1:9000/; 
    
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header REMOTE-HOST $remote_addr;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-Port $server_port;
    
    # Websocket
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_http_version 1.1;
    
    proxy_read_timeout 3600s;
    proxy_send_timeout 3600s;
    proxy_connect_timeout 60s;
    
    proxy_buffering off;
    proxy_redirect off;
    proxy_cookie_path / /editor/; # 注意有 / 结尾
    
    add_header X-Cache $upstream_cache_status;
    add_header Cache-Control no-cache;
    proxy_ssl_server_name off;
    proxy_ssl_name $proxy_host;
}

```

