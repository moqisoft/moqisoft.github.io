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

## 上传插件

将符合规范的插件包上传至 `/var/www/onlyoffice/documentserver/sdkjs-plugins` 挂载的宿主机目录，重启容器，即可在 toolbar 的插件选项卡下显示


官方提供了大量的插件示例，可以参考 https://api.onlyoffice.com/docs/plugin-and-macros/tutorials/samples/