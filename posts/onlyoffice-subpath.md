---
date: 2026-02-27T00:00:00.000Z
description: >-
  这篇关于 ONLYOFFICE 部署到 Nginx 子目录的实战文章，我已为你提取并整理为符合规范的 Markdown
  格式。文章详细说明了子目录部署的优势、场景、以及针对 ONLYOFFICE 的具体配置方案。
title: 遇到ONLYOFFICE必须部署到子目录？这份解决方案请收好
datetime: '2026-02-28 10:50:09'
permalink: /posts/onlyoffice-subpath
outline: deep
category: 文章
tags:
  - onlyoffice
  - 部署优化
prev:
  text: 企业级ONLYOFFICE + PostgreSQL部署避坑指南：参数优化与稳定性分析
  link: /posts/onlyoffice-postgresql-tuning
next:
  text: 如何避免合同在线编辑中的人为错误？一套更“工程化”的 OnlyOffice 使用方案
  link: /posts/user-readonly-mode
---

# 遇到ONLYOFFICE必须部署到子目录？这份解决方案请收好


在实际的企业运维、Web 架构设计以及多系统整合场景中，将应用部署到 **Nginx 子目录（Subdirectory）** 是一种非常常见且实用的方式。本文将从原理、典型应用场景、注意事项入手，系统讲解 **Nginx 子目录部署** 的常见模式，并重点讨论 **ONLYOFFICE Document Server 是否能部署到子目录？如何实现？需要注意什么？**


## 一、为什么将应用部署到 Nginx 子目录？

将应用部署到子目录，例如：
*   https://example.com/app/
*   https://example.com/office/
*   https://example.com/admin/

相比独立子域名（如 office.example.com ）有以下优势：

### 1. 单域名管理多个应用
同一个域名下运行多个系统，无需额外开子域名或端口，降低 DNS、证书、网关管理复杂度。

### 2. 更友好的网络拓扑，减少端口暴露
后端真实端口（如 3000/8082）隐藏在内网。

    用户访问 → Nginx → 内网应用

提升系统安全性。

### 3. 兼容性好，适用于旧系统或第三方组件
一些程序不支持自定义端口或必须使用固定目录，通过 Nginx Subdirectory 可轻松适配。

### 4. 前后端独立部署，多应用共存
多个 SPA、后端服务、脚本工具可通过不同路径共存于一个域名下。


## 二、Nginx 子目录常见部署模式

### 1. 子目录反向代理后端服务
最典型场景：访问 /app/ → 转发到内网 3000 端口。

```nginx
location /app/ {
    proxy_pass http://127.0.0.1:3000/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```
✔ proxy_pass 末尾 / 不能漏，否则路径拼接错误。


### 2. 子目录部署静态前端（Vue/React/Angular）
```nginx
location /app/ {
    alias /var/www/app/;
    try_files $uri $uri/ /app/index.html;
}
```

注意区别：
*   `root` 会自动拼接子目录；
*   `alias` 适合子目录映射；

前端框架必须配置 **base path**：

| 框架       | 配置示例           |
| :--------- | :----------------- |
| Vue Router | `base: '/app/'`    |
| React      | `PUBLIC_URL=/app/` |


### 3. 多应用复合部署示例
```nginx
server {
    listen 80;
    server_name example.com;

    location /admin/ {
        proxy_pass http://127.0.0.1:8080/;
    }

    location /app/ {
        alias /var/www/app/;
        try_files $uri $uri/ /app/index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:9000/;
    }
}
```


## 三、子目录部署需要特别注意的问题

| 问题点                 | 说明与建议                                                                               |
| :--------------------- | :--------------------------------------------------------------------------------------- |
| **路径斜杠细节**       | `/app` 与 `/app/` 在 Nginx 中完全不同，会影响 `proxy_pass` 拼接规则。                    |
| **alias vs root**      | 子目录使用 `alias` 更自然，否则路径容易错误。                                            |
| **SPA 路由**           | 需要 `try_files` 重写 `index.html`，否则刷新页面会 404。                                 |
| **资源路径必须带前缀** | 如果前端或后端写死根路径 `/`，放在子目录下会立即失效。**这点对于 ONLYOFFICE 非常关键。** |


## 四、ONLYOFFICE 能否部署到子目录？

### 官方明确：**ONLYOFFICE Document Server 不支持子目录部署（8以前版本）**

ONLYOFFICE 默认所有路径都写死为根路径 `/`：
```
/web-apps/
/doc/...
/sdkjs/
/fonts/
/cache/
```

直接代理到 `/office/` 会导致：
*   静态资源加载失败
*   WebSocket 无法连接
*   编辑器界面打不开
*   “Document Server is not available”

但实际生产中，企业确实有必须将 OnlyOffice 放到子目录的需求，例如：
```
https://example.com/office/
```

因此，虽然官方宣称不支持，但**翻阅9.1版本代码，可以通过 Nginx + 路径重写 + sub_filter 的方式实现子目录部署**。

接下来讲如何实现。


## 五、ONLYOFFICE 子目录部署可行方案（实战验证可用）

### 1. 部署架构
*   外部访问路径：`https://example.com/office/`
*   Document Server 内部服务：`http://127.0.0.1:8082/`


## 六、Nginx 子目录代理 ONLYOFFICE 配置（可用示例）

子目录部署需要你在前一层的代理服务器上配置转发规则，并携带关键头部信息。

只需增加 **`proxy_set_header X-Forwarded-Prefix /myeditor;`**（根据实际配置，以下三处 `myeditor` 保持一致），具体如下：

```nginx
location /myeditor/ {
    proxy_pass http://127.0.0.1:9000/;

    # 代理头设置
    proxy_set_header X-Forwarded-Prefix /myeditor;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header REMOTE-HOST $remote_addr;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-Port $server_port;
    proxy_set_header X-Forwarded-Host $host;

    # Websocket 支持
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_http_version 1.1;

    # 超时设置
    proxy_read_timeout 3600s;
    proxy_send_timeout 3600s;
    proxy_connect_timeout 60s;

    # 缓冲和重定向
    proxy_buffering off;
    proxy_redirect off;

    # Cookie 路径处理 - 如果后端应用需要
    # proxy_cookie_path / /myeditor/;

    # 缓存头
    add_header X-Cache $upstream_cache_status;
    add_header Cache-Control no-cache;

    # SSL 相关
    proxy_ssl_server_name on;
    proxy_ssl_verify off;
}
```


## 七、子目录部署的潜在问题与风险

| 风险点         | 说明                                                                                |
| :------------- | :---------------------------------------------------------------------------------- |
| **官方不支持** | 升级 OnlyOffice 版本可能需要重新测试规则（9以上版本没有明确）。                     |
| **重写成本高** | 原生写死的绝对路径太多（如 `/web-apps/` 与 `/doc/`），`sub_filter` 规则维护成本高。 |

## **总结**

推荐优先使用 **子域名部署**：`https://office.example.com`

若企业受限，才使用子目录方案。虽然 ONLYOFFICE 子目录部署可行，但需要清晰认识到其兼容性问题和维护成本。因此生产环境更建议使用子域名；若必须使用子目录部署，务必充分测试静态资源、WebSocket、协作文档保存等关键功能。

## 相关资源

*   OnlyOffice最新版本镜像，可访问： [OnlyOffice9.x](https://onlyoffice.moqisoft.com/docs/install/docker)
*   版本介绍： [documentserver 中国版](https://moqisoft.github.io/docs/product/summary)
*   OnlyOffice 中国版技术交流：[https://qm.qq.com/q/YzEIuNe1yy](https://qm.qq.com/q/YzEIuNe1yy)
