# 防截图水印 <span class="ant-tag">8.3.3+</span>

防截图水印是临时覆盖在文档上的水印（非文档内部的水印），主要是为了对截图等场景做留痕，不会存入文档内部，下载、打印时不存在。

<FeedsAds />

## 使用方法

对防截图水印的配置位于 `editorConfig.customization` 对象内

```json
{
  "customization": {
    "waterMark": {
      "value": "张三丰(190465)\\n192.168.80.163", // 支持使用 \\n 换行，建议不超过2行
      "fillstyle": "rgba( 192, 192, 192, 0.6 )", // 文字水印颜色，支持 rgba 和 hax 颜色（如：#ff0000）
      "font": "20px Arial", // 字号和字体
      "rotate": -30, // 旋转角度
      "horizontal": 30, // 水平间隔
      "vertical": 30 // 垂直间隔
    }
  }
}
```

![word](/images/watermark1.png)

![excel](/images/watermark2.png)
