# 连接器与自动化 API

> [!TIP]
> 该功能为高级版功能，如有需要请联系交流群（183026419）管理员

Connector 是一个允许从外部源编辑文本文档、电子表格、演示文稿、PDF 和可填写表单的类。一般用于和自己的各类业务系统做集成，通过自动化 API 方式修改文档，能力较金山文档的 JSSDK 等强大很多。

[点击查看 WPS SDK 官方文档](https://solution.wps.cn/docs/client/api/summary.html)  
[点击查看 ONLYOFFICE 连接器官方文档](https://api.onlyoffice.com/docs/docs-api/usage-api/automation-api/)

要创建连接器，请使用文档编辑器对象的 createConnector 方法：

```js
const connector = docEditor.createConnector();
```

连接器具有与插件相同的接口。可以在 [插件和宏页面](https://api.onlyoffice.com/docs/plugin-and-macros/customization/context-menu/) 找到大量可用的代码示例。

中国版完整实现了官方连接器的功能，可以轻松实现外部对文档的各类操作。

![连接器](/images/connector.png)
