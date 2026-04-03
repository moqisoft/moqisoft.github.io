---
description: 针对OnlyOffice表格协作，筛选仅对自己可见功能支持多人同时在同一工作表筛选数据互不干扰，如同WPS Excel体验，提升协同效率。
---

# 五星功能 / 强烈推荐👍👍👍

> [!TIP]  
> 以下功能基于最新高级版，为单独增强功能，如有需要请联系交流群（183026419）管理员

## 筛选对自己可见

onlyoffice cell 中无法像 wps 的 excel 一样，对工作表数据筛选时设置仅对自己可见，这样在多人协作时互不影响。

文档服务中国版支持【筛选仅对自己可见】，可以在同一 sheet 页筛选时互不影响。

#### 如何开启

获得授权后，筛选对自己可见功能需要全局开启，配置位于 `editorConfig` 对象内

```json
"editorConfig": {
    "customization": {
        // 开启筛选对自己可见功能，true 开启 false 关闭。
        "privateView": true,
    }
}
```

#### 如何使用

![如何使用筛选仅对自己可见](../../public/images/filter2.png)

#### 效果展示

<iframe src="//player.bilibili.com/player.html?isOutside=true&aid=116254497112291&bvid=BV1JpwCz5EDv&cid=36809542218&p=1" scrolling="no" border="0" width="100%" height="400" frameborder="no" framespacing="0" allowfullscreen="true"></iframe>

如需要该功能，请咨询交流群管理员。