---
description: >-
  一篇涵盖OnlyOffice中国版从Docker部署、中文字体定制、性能加速优化、个性化品牌配置到回调机制集成的全链路企业级落地指南。适合需要将OnlyOffice中国版接入OA、云盘、知识库等业务系统的开发团队参考。
title: 从零到一：OnlyOffice中国版企业级完整落地指南
datetime: '2026-04-12 22:49:34'
permalink: /posts/enterprise-deployment
outline: deep
category: 文章
tags:
  - onlyoffice
  - 部署
  - 性能优化
  - 集成实战
next:
  text: 业务系统深度集成：基于OnlyOffice中国版连接器实现合同生成、AI写作与报表自动化
  link: /posts/connector-integration
---

# 从零到一：OnlyOffice中国版企业级完整落地指南

## 一、本文的目标读者

如果你正在负责一个需要集成在线文档编辑能力的项目（OA系统、企业云盘、知识库、教育平台等），并且选择了 OnlyOffice 中国版作为文档引擎，本文将为你提供从服务部署到业务集成的完整技术路径。

本文不会重复官方文档的每一个配置项，而是聚焦于企业级落地过程中最容易踩坑的环节，以及中国版独有功能的正确使用方式。



## 二、部署阶段：把服务跑起来

### 2.1 镜像拉取

OnlyOffice 中国版通过 Docker 镜像分发，支持 AMD64 和 ARM64 架构。

```bash
# Docker Hub 直接拉取
docker pull moqisoft/documentserver:9.3.0

# 国内加速（推荐）
docker pull docker.1ms.run/moqisoft/documentserver:9.3.0
```

### 2.2 容器启动

以下是一个包含高级版所需参数的完整启动命令：

```bash
docker run -itd \
    --name ds-china \
    -p 9000:80 \
    -p 9090:8000 \
    --restart=always \
    --privileged \
    -e ALLOW_PRIVATE_IP_ADDRESS=true \
    -e JWT_ENABLED=false \
    -v /data/onlyoffice/Data:/var/www/onlyoffice/Data \
    -v /data/onlyoffice/App_Data:/var/www/onlyoffice/App_Data \
    -v /data/onlyoffice/sdkjs-plugins:/var/www/onlyoffice/documentserver/sdkjs-plugins \
    -v /proc/cpuinfo:/host/proc/cpuinfo \
    -v /sys/class:/host/sys/class \
    moqisoft/documentserver:9.3.0
```

**参数说明**：

| 参数                       | 说明                                   | 是否必须   |
| :------------------------- | :------------------------------------- | :--------- |
| `-p 9000:80`               | 编辑服务端口映射                       | 是         |
| `-p 9090:8000`             | 管理接口端口映射                       | 建议       |
| `--privileged`             | 特权模式，高级版获取机器码必须         | 高级版必须 |
| `ALLOW_PRIVATE_IP_ADDRESS` | 允许内网IP地址，解决容器内下载文件失败 | 是         |
| `JWT_ENABLED=false`        | 关闭JWT认证（开发阶段方便调试）        | 按需       |
| `-v .../Data`              | 数据目录，存放license等文件            | 高级版必须 |
| `-v .../App_Data`          | 应用数据目录，文档缓存等               | 建议       |
| `-v .../sdkjs-plugins`     | 插件目录，方便管理自定义插件           | 建议       |
| `-v /proc/cpuinfo`         | CPU信息映射，高级版机器码依赖          | 高级版必须 |
| `-v /sys/class`            | 系统信息映射，高级版机器码依赖         | 高级版必须 |

### 2.3 验证启动

```bash
# 查看容器日志，确认无报错
docker logs -f ds-china

# 访问版本信息
curl http://your-server-ip:9090/info

# 访问欢迎页面
# 浏览器打开 http://your-server-ip:9000/welcome/
```

> **注意**：访问地址不能使用 `localhost` 或 `127.0.0.1`，因为容器内部需要通过这个地址下载文件，使用本地回环地址会导致容器请求到自身内部。

### 2.4 部署常见问题速查

| 现象                 | 原因                           | 解决方案                                   |
| :------------------- | :----------------------------- | :----------------------------------------- |
| 文档下载失败         | 文件地址在容器内不可达         | 使用容器可访问的IP/域名                    |
| 安全令牌格式不正确   | JWT认证未关闭但未正确配置token | 设置 `JWT_ENABLED=false` 且开档时token留空 |
| 机器码每次重启都变化 | 未正确挂载目录或未开启特权模式 | 检查 `--privileged` 和三个必须挂载的目录   |
| 部分http请求         | CDN回源协议与访问协议不一致    | 确保CDN回源协议与源站一致                  |



## 三、字体定制：让文档"说中文"

### 3.1 中国版字体优势

OnlyOffice 中国版已经预置了常用的中文办公字体，开箱即可满足大部分中文办公场景。这是相比官方社区版的一大优势——官方版默认不包含中文字体，打开中文文档时经常出现字体缺失导致的排版异常。

### 3.2 追加自定义字体

如果企业有特殊字体需求（如品牌字体、行业专用字体），可以通过挂载方式追加：

```bash
# 启动时挂载自定义字体目录
docker run -itd \
    --name ds-china \
    # 其他参数...
    -v /data/onlyoffice/custom-fonts:/usr/share/fonts/truetype/custom \
    moqisoft/documentserver:9.3.0
```

将需要的字体文件（.ttf / .otf）放入宿主机的 `/data/onlyoffice/custom-fonts` 目录，重启容器即可生效。

**推荐做法**：使用追加方式而非完整替换。完整替换（挂载 `core-fonts` 目录）可能因缺失核心字体导致文件导出失败。

### 3.3 设置默认字体

中国版高级版支持通过配置修改编辑器的默认字体和字号：

```json
{
  "editorConfig": {
    "customization": {
      "font": {
        "size": 14,
        "name": "SimSun"
      }
    }
  }
}
```

对于企业内部系统，建议将默认字体设置为宋体或微软雅黑，默认字号设置为四号（14pt）或小四号（12pt），符合中文公文排版习惯。



## 四、性能加速：让文档打开更快

OnlyOffice 的文档打开流程涉及多个阶段：加载 JavaScript SDK → 下载原始文档 → 转换为中间格式 → 下载字体 → 渲染页面。中国版提供了多个优化手段。

### 4.1 静态资源预加载

从 9.2.1 版本开始，支持在打开文档前预先加载静态资源（HTML、CSS、JS、字体），加速首次打开速度。

**方式一：使用 placeholder 参数**

```html
<!-- 文档列表页面 -->
<div id="preloadPlaceholder" style="display:none"></div>
<script
  type="text/javascript"
  src="https://your-ds-server:9000/web-apps/apps/api/documents/api.js?placeholder=preloadPlaceholder"
></script>
```

当用户浏览文档列表时，SDK 会在后台预加载编辑器所需的静态资源。等用户点击打开文档时，这些资源已经在浏览器缓存中，可以显著减少加载时间。

**方式二：手动插入预加载 iframe**

```html
<iframe
  src="https://your-ds-server:9000/web-apps/apps/api/documents/preload.html"
  style="display:none;"
></iframe>
```

**适用场景**：在文档列表、工作台等用户打开文档前会停留的页面中使用。

> **注意**：预加载会消耗服务器带宽和用户流量，不建议在所有页面都启用，只在用户即将打开文档的场景中使用。

### 4.2 字体多域名加速

原理是将字体请求分散到多个域名，绕过浏览器对单域名的并发连接限制（通常为6个），实现并行下载。

**第一步：导出字体文件**

```bash
docker cp ds-china:/var/www/onlyoffice/documentserver/fonts ./fonts
```

**第二步：部署字体到多个域名**

将导出的字体文件分别部署到不同的域名/CDN，确保可以通过类似 `https://font1.yourdomain.com/fonts/000` 的地址正常下载。

**第三步：配置编辑器**

```json
{
  "editorConfig": {
    "customization": {
      "resPrefix": [
        "https://font1.yourdomain.com",
        "https://font2.yourdomain.com",
        "https://font3.yourdomain.com"
      ]
    }
  }
}
```

**第四步：配置字体域名的CORS**

字体服务器需要允许跨域访问：

```nginx
# 字体服务器的 Nginx 配置
location /fonts/ {
    add_header Access-Control-Allow-Origin *;
    add_header Access-Control-Allow-Methods GET;
    expires 30d;
}
```

实测效果：3个域名并行下载字体时，字体加载时间可缩短约 50%-60%。

### 4.3 反向代理层优化

在前端的 Nginx 反向代理上，也可以做一些通用的性能优化：

```nginx
location / {
    proxy_pass http://127.0.0.1:9000;

    # 开启 gzip 压缩
    gzip on;
    gzip_types text/plain application/json application/javascript text/css;
    gzip_min_length 1024;

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|gif|ico|woff|woff2|ttf)$ {
        proxy_pass http://127.0.0.1:9000;
        expires 7d;
        add_header Cache-Control "public, immutable";
    }

    # WebSocket 支持
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_http_version 1.1;

    # 超时设置（协同编辑需要长连接）
    proxy_read_timeout 3600s;
    proxy_send_timeout 3600s;
}
```



## 五、子目录部署：灵活的路径配置

在某些企业环境中，可能需要将 OnlyOffice 部署在反向代理的子目录下（如 `/office/` 而非根路径）。中国版完整支持子目录部署。

### 5.1 Nginx 配置示例

```nginx
location /office/ {
    proxy_pass http://127.0.0.1:9000/;
    
    # 关键头部：告知后端应用实际访问路径
    proxy_set_header X-Forwarded-Prefix /office;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    
    # WebSocket 支持
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_http_version 1.1;
    
    # 超时设置
    proxy_read_timeout 3600s;
    proxy_send_timeout 3600s;
}
```

**关键要点**：
*   `X-Forwarded-Prefix` 头部是必须的，告知后端实际访问路径
*   路径末尾的斜杠要一致（`location /office/` 对应 `proxy_pass .../`）
*   WebSocket 支持对于协同编辑至关重要



## 六、个性化配置：打造企业专属编辑器

### 6.1 品牌定制

将编辑器的 Logo 和品牌信息替换为企业自有标识：

```json
{
  "editorConfig": {
    "customization": {
      "logo": {
        "visible": true,
        "image": "https://your-domain.com/logo.png",
        "imageEmbedded": "https://your-domain.com/logo-small.png",
        "url": "https://your-domain.com"
      },
      "customer": {
        "address": "北京市朝阳区XX路XX号",
        "mail": "support@your-domain.com",
        "logo": "https://your-domain.com/logo-big.png",
        "name": "XX科技有限公司",
        "phone": "400-XXX-XXXX",
        "www": "your-domain.com"
      }
    }
  }
}
```

### 6.2 界面简化

根据业务需要隐藏不需要的界面元素：

```json
{
  "editorConfig": {
    "customization": {
      "about": false,
      "feedback": false,
      "goback": false,
      "help": false,
      "loaderLogo": "https://your-domain.com/loading-logo.png",
      "loaderName": "正在加载文档...",
      "features": {
        "spellcheck": false
      }
    }
  }
}
```

**建议**：
*   如果用户主要使用中文，建议关闭拼写检查（`spellcheck: false`），避免不必要的红色波浪线干扰
*   自定义加载Logo和文字可以提升品牌一致性
*   关闭"关于"和"反馈"菜单，避免用户看到 OnlyOffice 的品牌信息

### 6.3 WebSocket降级配置

在政务或涉密网络环境中，网闸设备可能不允许WebSocket长连接通过。中国版高级版支持将 WebSocket 强制降级为长轮询：

```json
{
  "editorConfig": {
    "customization": {
      "polling": true
    }
  }
}
```

降级后，协同编辑功能不受影响，只是通信方式从 WebSocket 切换为 HTTP 长轮询，上层业务完全无感知。这对于需要穿越网闸的政务和军工项目尤为重要。



## 七、高级功能增强（中国版特有）

中国版在官方社区版基础上，提供了一系列增强功能，可显著提升用户体验。

### 7.1 迷你工具栏

迷你工具栏是 WPS 风格的浮动工具栏，在用户选中文本时自动显示，提供快速的字体和段落格式化功能。

**开启配置**：

```json
{
  "editorConfig": {
    "customization": {
      "miniToolbar": true
    }
  }
}
```

**适用场景**：
*   需要类似 WPS 的选中文本快速编辑体验
*   简化用户的格式化操作流程
*   目前仅支持 Word 编辑器

> **注意**：该功能为高级版功能，需要额外授权

### 7.2 本地字体加速

针对中文字体体积大、加载慢的问题，中国版提供了"本地字体"功能。通过智能裁剪 CJK 字体，仅保留排版计算需要的测量表，渲染时自动探测浏览器本地字体回落，可将字体加载体积减少 95%。

**开启配置**：

```json
{
  "editorConfig": {
    "customization": {
      "browserFonts": true
    }
  }
}
```

**效果对比**：

| 对比项                 | 优化前 | 优化后                  |
| ---------------------- | ------ | ----------------------- |
| 中文字体下载（SimSun） | 18MB   | 289KB                   |
| 打开时间               | 8~12s  | 2~4s（速度提升 3~4 倍） |
| 完整字体目录           | 416MB  | 21MB（减少 95%）        |

> **注意**：该功能为高级版功能，需要额外授权

### 7.3 筛选对自己可见（Excel）

在多人协作编辑 Excel 时，中国版支持"筛选仅对自己可见"功能，类似 WPS 的表格体验。不同用户可以在同一工作表设置不同的筛选条件，互不干扰。

**开启配置**：

```json
{
  "editorConfig": {
    "customization": {
      "privateView": true
    }
  }
}
```

**适用场景**：
*   多人协作的数据分析场景
*   不同角色关注不同数据子集
*   避免筛选操作影响其他协作者

> **注意**：该功能为高级版功能，需要额外授权

### 7.4 PPT 视频播放

社区版 PPT 不支持播放视频，中国版对此做了能力增强，支持在编辑器中直接预览和播放 PPT 中插入的视频。

**特性**：
*   支持 PPT 中插入的视频直接播放
*   使用系统自带 video 能力解码
*   支持播放、暂停、拖动时间轴、音量调节等功能

> **注意**：该功能为高级版功能，需要额外授权



## 八、业务集成：打通文档编辑闭环

### 8.1 集成架构

一个典型的文档编辑集成架构如下：

```
┌─────────────┐         ┌──────────────────┐
│   浏览器     │────────→│  业务系统前端     │
│  (编辑器)    │         │  (Vue/React等)    │
└──────┬──────┘         └────────┬─────────┘
       │                         │
       │ api.js                  │ 获取开档配置
       ↓                         ↓
┌──────────────┐         ┌──────────────────┐
│  OnlyOffice  │←────────│  业务系统后端     │
│  DocServer   │────────→│  (Java/Node等)    │
└──────────────┘         └────────┬─────────┘
   下载文件 ↑   回调通知 ↓         │
            └─────────────────────┘
                                  │
                           ┌──────┴──────┐
                           │  文件存储    │
                           │  (OSS/NAS)  │
                           └─────────────┘
```

### 8.2 核心流程：文档编辑与保存

理解 OnlyOffice 的文档编辑保存机制是成功集成的关键：

**开档流程**：

1. 用户点击打开文档
2. 业务后端生成开档配置（包含 `document.key`、`document.url`、权限等）
3. 前端使用配置初始化编辑器
4. OnlyOffice 从 `document.url` 下载原始文件，转换为中间格式
5. 浏览器加载中间格式文件进行渲染

**保存流程**：

1. 用户编辑完成，关闭编辑器（或触发强制保存）
2. OnlyOffice 将中间格式转回原始文件格式（如 .docx）
3. OnlyOffice 通过 callback URL 通知业务后端
4. 业务后端从回调参数中获取新文件的下载地址
5. 业务后端下载新文件，覆盖存储中的原始文件
6. 业务后端返回 `{"error": 0}` 确认处理成功

**回调接口示例（Node.js）**：

```javascript
app.post("/onlyoffice/callback", async (req, res) => {
  const { status, url, key, users } = req.body;

  switch (status) {
    case 1:
      // 正在编辑中，有用户连接
      console.log(`文档 ${key} 正在被编辑，用户: ${users}`);
      break;

    case 2:
      // 文档已保存（所有用户退出编辑后触发）
      // 下载最新文档并更新存储
      await downloadAndSave(url, key);
      console.log(`文档 ${key} 已保存`);
      break;

    case 6:
      // 强制保存触发
      await downloadAndSave(url, key);
      console.log(`文档 ${key} 强制保存完成`);
      break;

    case 4:
      // 关闭文档，无更改
      console.log(`文档 ${key} 已关闭，无更改`);
      break;
  }

  // 必须返回 {"error": 0}
  res.json({ error: 0 });
});

async function downloadAndSave(fileUrl, docKey) {
  const response = await fetch(fileUrl);
  const buffer = await response.buffer();

  // 根据 docKey 找到对应的文档记录
  const doc = await findDocByKey(docKey);

  // 将新文件保存到存储（OSS/本地）
  await saveToStorage(doc.storagePath, buffer);

  // 更新文档版本号
  await updateDocVersion(doc.id);
}
```

### 8.3 document.key 的管理

`document.key` 是 OnlyOffice 缓存机制的核心。关键规则：

*   **同一个 key = 同一个编辑会话**：多个用户使用相同的 key 打开同一个文件，会进入协同编辑状态
*   **key 变了 = 新的编辑会话**：必须使用新的 key + 对应的新文件
*   **文件变了但 key 没变 = 版本冲突**：会提示"版本已更新"

推荐的 key 管理策略：

```javascript
// 方式一：使用自增版本号
const key = `doc_${documentId}_v${versionNumber}`;

// 方式二：使用文件内容的 hash
const key = `doc_${documentId}_${fileContentHash}`;

// 方式三：使用时间戳（简单但不适合需要协同的场景）
const key = `doc_${documentId}_${lastModifiedTimestamp}`;
```

**核心原则**：key 与文件内容严格对应。保存回调处理完成后，下次打开必须使用新的 key。

### 8.4 前端集成示例

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>文档编辑</title>
  <!-- 引入 OnlyOffice API -->
  <script src="http://your-ds-server:9000/web-apps/apps/api/documents/api.js"></script>
</head>
<body>
  <div id="editor-container" style="width:100%;height:100vh;"></div>

  <script>
    // 从后端获取开档配置
    async function openDocument(docId) {
      const response = await fetch(`/api/documents/${docId}/editor-config`);
      const config = await response.json();

      // 初始化编辑器
      const docEditor = new DocsAPI.DocEditor("editor-container", {
        document: {
          fileType: config.fileType,
          key: config.key,
          title: config.title,
          url: config.fileUrl,
          permissions: config.permissions
        },
        documentType: config.documentType, // word, cell, slide
        editorConfig: {
          callbackUrl: config.callbackUrl,
          lang: "zh",
          mode: config.mode, // edit 或 view
          user: {
            id: config.userId,
            name: config.userName
          },
          customization: {
            about: false,
            feedback: false,
            forcesave: true, // 支持手动保存
            font: {
              size: 14,
              name: "SimSun"
            }
          }
        },
        events: {
          onReady: function () {
            console.log("编辑器加载完成");
          },
          onError: function (event) {
            console.error("编辑器错误:", event.data);
          }
        }
      });
    }

    // 页面加载时打开文档
    const docId = new URLSearchParams(location.search).get("id");
    if (docId) openDocument(docId);
  </script>
</body>
</html>
```



## 九、管理面板的使用

中国版保留了 adminpanel 管理面板功能（官方社区版自 9.3.0 已移除），提供图形化的配置管理界面。

### 9.1 启动管理面板

```bash
docker exec ds-china sudo supervisorctl start ds:adminpanel
```

### 9.2 获取初始化码

首次启动后，在容器日志中会输出类似信息：

```
AdminPanel SETUP REQUIRED | Bootstrap code: IK6HKVU0YMB3 | Expires: ...
```

### 9.3 初始化设置

浏览器访问 `http://your-server-ip:9000/adminpanel`，输入 Bootstrap code 完成初始化。

管理面板可以在图形界面中修改常用配置，免去直接编辑配置文件的麻烦。



## 十、生产环境检查清单

在正式上线前，建议逐项检查：

### 10.1 基础服务

- [ ] 容器正常启动，无报错日志
- [ ] 欢迎页面可正常访问
- [ ] 版本信息接口返回正确
- [ ] 文档打开、编辑、保存流程完整可用
- [ ] 回调接口正确处理了 status=2 和 status=6

### 10.2 网络配置

- [ ] 文件下载地址在容器内可达
- [ ] HTTPS 证书在反向代理层部署（不在容器内部）
- [ ] WebSocket 连接正常（或已配置长轮询降级）
- [ ] CDN 回源协议与源站一致

### 10.3 安全配置

- [ ] 生产环境已开启 JWT 认证（或通过其他方式保护接口）
- [ ] 敏感文档已配置防截图水印
- [ ] 内部剪切板已按需配置（copyOut 权限）
- [ ] 权限字段已显式传递（不依赖默认值）
- [ ] 回调接口已做身份验证

### 10.4 性能优化

- [ ] 静态资源预加载已在合适的页面启用
- [ ] 字体多域名加速已配置（如有条件）
- [ ] 本地字体功能已开启（高级版）
- [ ] Nginx 已开启 gzip 压缩
- [ ] 静态资源设置了合理的缓存策略

### 10.5 运维保障

- [ ] 数据目录已持久化挂载（文档缓存不会因容器重建丢失）
- [ ] 容器设置了 `--restart=always`
- [ ] PostgreSQL 参数已按生产环境优化（参考PostgreSQL调优指南）
- [ ] 监控告警已配置（容器存活、磁盘空间、内存使用等）



## 十一、常见集成问题排查思路

### 11.1 问题一：文档打开白屏或报错

排查思路：
1. 浏览器控制台是否有 JS 报错
2. `api.js` 是否正确加载（检查网络请求）
3. 文档下载地址是否在容器内可达（进入容器测试 `curl`）
4. 文件格式是否在支持列表中

### 11.2 问题二：编辑后保存没有回调

排查思路：
1. `callbackUrl` 是否正确配置且可被容器访问
2. 是否所有编辑用户都已关闭文档（只有全部退出后才触发 status=2）
3. 是否开启了 `forcesave`（如需手动保存触发回调）
4. 回调接口是否返回了 `{"error": 0}`

### 11.3 问题三：再次打开提示版本更新

排查思路：
1. 保存回调后是否更新了 `document.key`
2. 原始文件是否已被新文件覆盖
3. 是否存在多个用户使用不同 key 打开同一文件的情况



## 十二、总结

OnlyOffice 中国版的企业级落地不仅仅是"把容器跑起来"这么简单。从部署到字体定制、性能优化、品牌个性化、业务集成，每一步都有需要注意的细节。

本文覆盖的核心环节：

| 阶段         | 核心任务                                                 |
| :----------- | :------------------------------------------------------- |
| **部署阶段** | Docker启动、参数配置、环境验证、子目录部署               |
| **字体定制** | 中文字体预置、自定义字体追加、默认字体设置、本地字体加速 |
| **性能加速** | 资源预加载、字体多域名并行、Nginx优化                    |
| **品牌定制** | Logo替换、界面简化、加载页定制                           |
| **功能增强** | 迷你工具栏、筛选对自己可见、PPT视频播放、长轮询降级      |
| **业务集成** | 开档配置、回调处理、key管理、前端嵌入                    |
| **运维保障** | 管理面板、生产检查清单、问题排查思路                     |

> **成功的文档编辑集成，需要的不是某一个环节的极致优化，而是全链路每个环节都做到位。希望本文能帮助你少走弯路，快速将 OnlyOffice 中国版落地到你的业务系统中。**

## 相关资源

*   OnlyOffice Callback 官方文档：[https://api.onlyoffice.com/docs/docs-api/usage-api/callback-handler/](https://api.onlyoffice.com/docs/docs-api/usage-api/callback-handler/)
*   OnlyOffice最新版本9.x镜像：[https://onlyoffice.moqisoft.com/docs/install/docker](https://onlyoffice.moqisoft.com/docs/install/docker)
*   版本介绍：[https://onlyoffice.moqisoft.com/docs/product/summary](https://onlyoffice.moqisoft.com/docs/product/summary)
*   OnlyOffice 中国版技术交流：[https://qm.qq.com/q/YzEIuNe1yy](https://qm.qq.com/q/YzEIuNe1yy)
