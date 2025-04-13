---
{ "search": false }
---

# 在线手册

## 使用说明

### 安装 nodejs 及依赖

```bash
# 安装 nodejs
https://nodejs.org/zh-cn

# 安装依赖
npm i

# 启动
npm run dev # 访问 http://127.0.0.1:5173

```

## 内容暂存

参考 wps 开放平台文档站点 https://solution.wps.cn/docs/，后续使用此站点 md 生成离线的 pdf 文档

```
快速上手
	开始 https://solution.wps.cn/docs/start/summary.html
安装部署

在线预览编辑
	概述 https://solution.wps.cn/docs/editing/summary.html
	服务端回调
		概述 https://solution.wps.cn/docs/callback/summary.html
		xxx
	前端SDK
		概述 https://solution.wps.cn/docs/web/summary.html
		xxx
	JSAPI
		概述 https://solution.wps.cn/docs/client/api/summary.html
		总览
		公共 https://solution.wps.cn/docs/client/api/common/common.html
		文字
            文档实例 https://solution.wps.cn/docs/client/api/word/Application.html
            活动文档 https://solution.wps.cn/docs/client/api/word/Document.html
		表格
		演示
		枚举
	开发Demo

文档格式转换（未来）

```

Application
.Toolbar
.Filebars
.Visible
.Hide()
.Show()
.Item('id') | .Item(index)
.Text
.DisabledState
.Hide()
.Show()
.Disable()
.Enable()
Application
.ActiveDocument | .ActiveWorkbook | .ActivePresentation
.SetReadOnly({readOnly: true})
.Download()
.Save()
.Print()
.Export()
.FileInfo
// .Title
// .FileType
.FileId
.OutFileId
// .OfficeType
