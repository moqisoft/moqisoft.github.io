---
description: onlyoffice中国版提供通过插件或连接器动态切换权限，方便从外部动态控制权限。
---

# 动态切换权限 <span class="ant-tag">9.3.0+支持</span>

> [!TIP]  
> - 该功能为高级版功能，如有需要请联系交流群（183026419）管理员
> - 该功能目前处于实验性阶段，仅支持 `Word` `Excel` `PPT` 的 PC 模式

该功能允许在插件或连接器内对当前用户的部分权限做动态控制。

## 使用方法

```js

// 连接器内
connector.callCommand(function () {
    Api.changePermissions({
        edit: false
    })
});

// 插件内
window.Asc.plugin.callCommand(function () {
    Api.changePermissions({
        edit: false
    })
});

```

## 参数说明

|         | 说明                             | 参数类型 |
| ------- | -------------------------------- | -------- |
| comment | 是否允许评论                     | Boolean  |
| copy    | 是否允许复制                     | Boolean  |
| copyOut | 是否允许复制到外部（中国版特有） | Boolean  |
| edit    | 是否允许编辑                     | Boolean  |
| print   | 是否允许打印                     | Boolean  |
