# 降级为长轮询 <span class="ant-tag">8.3.3+</span>

> [!TIP]
> 该功能为高级版功能，如有需要请联系交流群（183026419）管理员

在某些网络环境下，网关层因为一些安全管控等原因，存在一层网闸的隔离转发（ZF 或 SM 项目）。此种场景下一般不允许使用长连接。

此时可以使用中国版提供的强制降级能力，切换为长轮询，上层业务无感知。

<FeedsAds />

## 开启功能

```js
editorConfig: {
    customization: {
        // 将Websocket强制降级为长轮询，true 开启 false 关闭
        polling: true,
    },
}
```

![上传插件](/images/polling.png)
