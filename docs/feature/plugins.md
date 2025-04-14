# 安装本地插件

## 开启插件

```js
editorConfig: {
    customization: {
        // tab中的插件菜单，true 显示 false 隐藏
        plugins: true,
    },
}
```

## 将插件目录映射到宿主机

```bash
docker run --name only8-china -itd -p 80:80 --restart=always -e ALLOW_PRIVATE_IP_ADDRESS=true -e JWT_ENABLED=false -v yourpath/sdkjs-plugins:/var/www/onlyoffice/documentserver/sdkjs-plugins  documentserver-china
```
