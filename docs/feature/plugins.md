# 安装本地插件

> [!IMPORTANT]
> 考虑到国网络内环境，中国版默认删除了官方自带的所有插件。如果需要原版插件，请按下方挂载目录后下载解压覆盖并重启容器。

[下载官方默认插件](../../public/sdkjs-plugins.zip)

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
docker run -itd \    
    --name ds-china \  
    # 其它配置项...  
    -v /host/path/to/sdkjs-plugins:/var/www/onlyoffice/documentserver/sdkjs-plugins  \       
    # 其它配置项...
    moqisoft/documentserver:latest
```

## 上传插件

将符合规范的插件包上传至 `/var/www/onlyoffice/documentserver/sdkjs-plugins` 挂载的宿主机目录，重启容器，即可在 toolbar 的插件选项卡下显示

![上传插件](/images/plugins.png)


官方提供了大量的插件示例，可以参考 https://api.onlyoffice.com/docs/plugin-and-macros/samples/plugin-samples/

如果你有插件定制需求，也可联系QQ（327654929）。
