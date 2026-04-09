---
description: 中国版独家提供迷你工具栏，内置字体、字号、加粗/斜体、颜色等常用功能，实现“所见即操作”。支持扩展自定义功能按钮，满足不同业务场景需求。
---

# 迷你工具栏 / 五星功能 / 强烈推荐👍👍👍

> [!TIP]  
> 以下功能基于最新高级版，为单独增强功能，如有需要请联系交流群（183026419）管理员

迷你工具栏是 WPS 风格的浮动工具栏，在用户选中文本时自动显示，提供快速的字体和段落格式化功能。

**特性**：
- 选中文本时自动弹出，根据周围空间自动在最优位置显示
- 支持基础格式化操作（加粗、斜体、下划线、字体、字号等）
- 支持插件扩展，可动态添加自定义按钮

## 如何开启

获得授权后，迷你工具栏功能需要全局开启，配置位于 `editorConfig` 对象内。目前仅支持 word 编辑器。

```json
"editorConfig": {
    "customization": {
        // 开启迷你工具栏，true 开启 false 关闭。
        "miniToolbar": true,
    }
}
```

## 支持的功能

- 基础格式化：复制、粘贴、剪切、加粗、斜体、下划线、字体、字号、颜色、行距、对齐等
- 插件扩展：支持插件扩展，可动态添加自定义按钮


## 插件插入菜单

插件可以通过 SDK API 向迷你工具栏添加自定义按钮或菜单，API 风格与官方右键菜单（contextMenu）等一致。

注意：插件需要自行实现。

#### 示例：插件向迷你工具栏添加多个按钮及下拉菜单

```js
window.Asc.plugin.init = function () {
    // 插件插入的下拉菜单数据
    const miniDropDown = [
        {
            id: "id_share",
            text: "下拉1",
            data: "1",
            lockInViewMode: true,
        },
        {
            id: "id_follow",
            text: "下拉2",
            data: "2",
            enableToggle: true,
            lockInViewMode: false,
        },
        {
            id: "id_none",
            text: "下拉3",
            data: "3",
            enableToggle: true,
            lockInViewMode: false,
        }
    ];
    // 插件插入的按钮组 
    const subItems = [
        {
            id: "id_1",
            type: "button",
            text: "图标+文字",
            hint: "图标+文字",
            enableToggle: false,
            lockInViewMode: false,
            icons: "resources/img/screen.svg",
            separator: true,
        },
        {
            id: "id_2",
            type: "button",
            hint: "单纯图标",
            enableToggle: false,
            lockInViewMode: false,
            icons: "resources/img/screen.svg",
            separator: true,
        },
        {
            id: "id_3",
            type: "button",
            text: "单纯文字",
            hint: "单纯文字",
            enableToggle: false,
            lockInViewMode: false,
            separator: true,
        },
        {
            id: "id_4",
            type: "button",
            text: "下拉菜单",
            hint: "下拉菜单",
            enableToggle: true,
            lockInViewMode: false,
            icons: "resources/img/screen.svg",
            separator: false,
            split: false,
            items: miniDropDown,
        },
    ]
    Asc.plugin.attachEvent("onMiniToolbarShow", (options) => {
        const miniToolbarItems = {
            guid: window.Asc.plugin.guid,
            items: subItems,
        };

        this.executeMethod("AddMiniToolbarItem", [miniToolbarItems]);
    });
    Asc.plugin.event_onMiniToolbarClick = (id) => {
        console.log("mini 菜单点击了:", id)
    };
};
```


## 效果展示

<iframe src="//player.bilibili.com/player.html?isOutside=true&aid=116372877085611&bvid=BV12JDpBvEuE&cid=37341499206&p=1" scrolling="no" border="0" width="100%" height="400" frameborder="no" framespacing="0" allowfullscreen="true"></iframe>

如需要该功能，请咨询交流群管理员。