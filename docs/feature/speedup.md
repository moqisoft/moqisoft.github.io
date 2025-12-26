# 访问加速

onlyoffice 的业务流程导致部分性能问题，中国版通过优化资源加载逻辑，达到部分加速效果。

## 使用静态资源预加载

从 `9.2.1` 版本开始，你可以在打开文档前预先将静态资产（HTML、CSS、JS、字体）加载到浏览器缓存中，以加快文档编辑器的首次加载速度。你可以使用以下两种方法中的一种。

#### 使用 placeholder 参数

```html
<div id="placeholderId" style="display:none"></div>
<script
  type="text/javascript"
  src="https://documentserver/web-apps/apps/api/documents/api.js?placeholder=placeholderId"
></script>
```

注意：此 div 一定要在 `api.js` 之前创建

#### 手动插入预加载 iframe

你也可以手动插入指向预加载页面的隐藏指向

```html
<iframe
  src="https://documentserver/web-apps/apps/api/documents/preload.html"
  style="display:none;"
></iframe>
```

> [!TIP]  
> 预加载逻辑需要在打开文档前的页面触发，此时也会集中下载字体等资源，会消耗服务器带宽及用户流量。

## 开启字体加速

原理是，将字体拆分为多个域名请求，从而绕过浏览器对单域名连接数限制实现并行加载，还可以单独做 cdn 加速，加快下载及渲染速度。

第一步：增加配置项

```json
"editorConfig": {
    "customization": {
        // 将字体拆分为多个域名请求
        "resPrefix": ["https://yourdomain1.com", "https://yourdomain2.com"],
    },
}
```

第二步：将容器内 `fonts` 目录下的字体文件导出，分别部署到上述域名下，验证可以使用 `https://yourdomain1.com/fonts/000` 正常下载。

```bash
# 导出字体文件
docker cp 容器名:/var/www/onlyoffice/documentserver/fonts ./fonts
```

第三步：配置字体访问允许跨域，验证文档打开及编辑是否正常。

效果展示（三个域名同时在下载字体）

![效果展示](/images/domains.png)

![效果展示](/images/domains2.png)
