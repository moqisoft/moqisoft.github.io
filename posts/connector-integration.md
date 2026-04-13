---
date: 2026-04-12T00:00:00.000Z
description: >-
  深入讲解OnlyOffice中国版连接器（Connector）与自动化API的实战应用。通过合同模板自动填充、AI辅助写作、Excel报表自动生成三大真实场景，展示如何用JSAPI将文档编辑器深度融入业务系统。
title: 业务系统深度集成：基于OnlyOffice中国版连接器实现合同生成、AI写作与报表自动化
datetime: '2026-04-12 11:00:00'
permalink: /posts/connector-integration
outline: deep
category: 文章
tags:
  - onlyoffice
  - 连接器
  - JSAPI
  - 业务集成
prev:
  text: 从零到一：OnlyOffice中国版企业级完整落地指南
  link: /posts/enterprise-deployment
next:
  text: 企业文档防泄漏实战：基于OnlyOffice中国版构建多层安全防护体系
  link: /posts/document-security
---

# 业务系统深度集成：基于OnlyOffice中国版连接器实现合同生成、AI写作与报表自动化

## 一、为什么需要连接器

在大多数企业系统中，文档编辑器只是一个"嵌入式组件"——用户打开、编辑、保存，仅此而已。但真实业务场景中，我们往往需要从外部系统控制文档内容：

*   合同系统需要将业务数据自动填入合同模板
*   AI写作系统需要将生成的内容插入到光标位置
*   报表系统需要将统计数据写入Excel并自动生成图表
*   审批系统需要在文档中自动插入审批意见和签章

这些需求的共同特点是：**操作文档的主体不是用户，而是外部系统**。

OnlyOffice 提供了 **连接器（Connector）** 机制来满足这类需求。中国版完整实现了官方连接器的全部功能，兼容官方 JSAPI，并可与**用户只读模式**、**动态权限切换**等增强功能配合使用，构建出更强大的业务集成方案。

> **中国版连接器增强能力**：
> *   兼容官方 Automation API，支持 Word/Excel/PPT 全文档类型操作
> *   可与用户只读模式配合：用户无法手动编辑，但连接器可操作文档
> *   支持动态权限切换：运行时通过连接器修改用户权限
> *   支持细粒度文档操作：段落、Run、样式、图表等均可操控



## 二、连接器基础

### 2.1 什么是连接器

连接器是 OnlyOffice 文档编辑器提供的 JavaScript API 接口，允许外部代码（宿主页面）对正在编辑的文档执行操作。它与插件（Plugin）拥有相同的底层接口，但使用方式更灵活：

*   **插件**：需要打包部署到 documentserver 内部，通过编辑器内的插件菜单激活
*   **连接器**：直接在宿主页面的 JavaScript 中调用，无需部署任何文件

对于业务系统集成来说，**连接器是更合适的选择**。

### 2.2 创建连接器

在初始化编辑器后，通过 `createConnector` 方法获取连接器实例：

```javascript
// 初始化编辑器
const docEditor = new DocsAPI.DocEditor("placeholder", config);

// 创建连接器
const connector = docEditor.createConnector();
```

### 2.3 核心方法

连接器提供两个核心方法：

**`callCommand`** —— 在文档上下文中执行代码：

```javascript
connector.callCommand(function () {
    // 这里的代码运行在文档编辑器内部
    // 可以使用 Api 对象操作文档
    var oDocument = Api.GetDocument();
    // ...
});
```

**`executeMethod`** —— 调用编辑器提供的方法：

```javascript
connector.executeMethod("InsertTextToCursor", ["Hello World"]);
```

两者的区别在于：`callCommand` 内的函数运行在编辑器沙箱中，可以调用完整的文档操作 API；`executeMethod` 是对常用操作的封装，调用更简洁。

> **注意**：`callCommand` 中的函数是序列化后传递到编辑器内部执行的，因此**不能引用外部变量**。需要传递数据时，可以通过函数返回值或事件机制。



## 三、场景一：合同模板自动填充

### 3.1 业务需求

某企业合同管理系统的需求：

*   合同使用标准 Word 模板，包含固定条款和可变字段
*   业务人员在系统中填写合同要素（甲乙方、金额、期限等）
*   系统自动将数据填入模板对应位置
*   用户在编辑器中只能查看结果，不能手动编辑

### 3.2 模板设计

在 Word 模板中，使用特定格式的占位符标记可变内容，例如：

```
甲方：{{partyA}}
乙方：{{partyB}}
合同金额：人民币 {{amount}} 元整
合同期限：{{startDate}} 至 {{endDate}}
```

### 3.3 技术实现

**第一步：配置编辑器**

使用用户只读模式，确保用户不能手动编辑，但连接器可以操作文档：

```javascript
const config = {
  document: {
    fileType: "docx",
    key: contractKey,
    title: "采购合同-2026-0412",
    url: templateDownloadUrl,
    permissions: {
      edit: true,
      copy: true,
      copyOut: false,
      print: true
    }
  },
  editorConfig: {
    mode: "edit",
    customization: {
      readOnly: true,  // 用户只读模式
      waterMark: {
        value: `${currentUser.name}\\n合同预览`,
        fillstyle: "rgba(192, 192, 192, 0.2)",
        font: "14px SimHei",
        rotate: -30,
        opacity: 0.2
      }
    }
  }
};
```

**第二步：获取业务数据并填充**

当用户在业务表单中填写完合同要素后，通过连接器将数据写入文档：

```javascript
// 业务数据
const contractData = {
  partyA: "北京某某科技有限公司",
  partyB: "上海某某信息技术有限公司",
  amount: "壹佰贰拾叁万肆仟伍佰陆拾柒",
  amountNum: "1,234,567.00",
  startDate: "2026年04月12日",
  endDate: "2027年04月11日",
  signDate: "2026年04月12日"
};

// 通过连接器填充数据
function fillContract(data) {
  const connector = docEditor.createConnector();

  // 将数据序列化后传入
  const jsonData = JSON.stringify(data);

  connector.callCommand(function () {
    // 在文档上下文中执行
    var oDocument = Api.GetDocument();
    var aElements = oDocument.GetAllContentControls();

    // 如果使用内容控件方式
    for (var i = 0; i < aElements.length; i++) {
      var tag = aElements[i].GetTag();
      // 根据 tag 匹配字段并替换
    }
  });

  // 也可以使用搜索替换方式
  connector.callCommand(function () {
    var oDocument = Api.GetDocument();

    // 使用 SearchAndReplace 方法
    var oSearchData = {
      searchString: "{{partyA}}",
      replaceString: "北京某某科技有限公司",
      matchCase: true
    };

    oDocument.SearchAndReplace(oSearchData);
  });
}
```

**第三步：逐字段替换的完整实现**

实际项目中，建议封装一个通用的模板填充方法：

```javascript
function fillTemplate(connector, fieldMap) {
  const entries = Object.entries(fieldMap);

  // 由于 callCommand 内部不能引用外部变量
  // 需要逐个字段调用，或者将数据编码到函数体中
  entries.forEach(([placeholder, value]) => {
    // 动态构造函数字符串
    const script = `
      var oDocument = Api.GetDocument();
      oDocument.SearchAndReplace({
        searchString: "{{${placeholder}}}",
        replaceString: "${value.replace(/"/g, '\\"')}",
        matchCase: true
      });
    `;

    connector.callCommand(new Function(script));
  });
}

// 使用
fillTemplate(connector, {
  partyA: contractData.partyA,
  partyB: contractData.partyB,
  amount: contractData.amount,
  amountNum: contractData.amountNum,
  startDate: contractData.startDate,
  endDate: contractData.endDate
});
```

### 3.4 用户只读模式详解

用户只读模式是中国版特有的功能，可以实现"用户不可编辑，但连接器可操作文档"的效果。

**与普通只读模式的区别**：

| 模式                       | 用户能否编辑 | 连接器能否操作 | 适用场景             |
| -------------------------- | ------------ | -------------- | -------------------- |
| 普通只读（mode: view）     | 否           | 否             | 纯预览场景           |
| 用户只读（readOnly: true） | 否           | **是**         | 合同生成、公文套打等 |

**配置要点**：

```json
{
  "editorConfig": {
    "customization": {
      "readOnly": true
    },
    "permissions": {
      "edit": true
    },
    "mode": "edit"
  }
}
```

三个字段必须同时配置：`mode` 设为 `edit`、`permissions.edit` 设为 `true`、`customization.readOnly` 设为 `true`。

> **注意**：用户只读模式为高级版功能，目前仅支持 Word/Excel/PPT 的 PC 模式

### 3.5 关键注意事项

*   模板占位符应使用不易与正文冲突的格式（如 `{{fieldName}}`）
*   替换操作完成后，建议调用保存接口生成最终文档
*   用户只读模式保证了模板结构和法律条款不会被手动修改
*   结合防截图水印，可以在合同预览阶段保护内容安全



## 四、场景二：AI辅助写作集成

### 4.1 业务需求

某内容管理平台需要集成 AI 写作能力：

*   用户在文档中编辑时，可以通过侧边栏调用 AI 功能
*   AI 生成的内容可以插入到当前光标位置
*   支持 AI 润色：选中文本 → 调用 AI 改写 → 替换原文
*   支持 AI 续写：在光标位置根据上下文续写内容

### 4.2 架构设计

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   业务前端    │────→│  AI 服务端    │────→│  大语言模型   │
│  (侧边栏)    │←────│  (API网关)    │←────│  (LLM)       │
└──────┬───────┘     └──────────────┘     └──────────────┘
       │
       │ connector.callCommand()
       ↓
┌──────────────┐
│  OnlyOffice  │
│  编辑器      │
└──────────────┘
```

### 4.3 核心实现

**获取选中文本，发送给AI处理**：

```javascript
// 获取当前选中的文本
function getSelectedText(connector) {
  return new Promise((resolve) => {
    connector.callCommand(
      function () {
        var oDocument = Api.GetDocument();
        var selectedText = oDocument.GetSelectedText();
        return selectedText;
      },
      false, // isNoCalc
      function (result) {
        resolve(result);
      }
    );
  });
}

// AI润色流程
async function aiPolish() {
  const selectedText = await getSelectedText(connector);

  if (!selectedText) {
    alert("请先选中需要润色的文本");
    return;
  }

  // 调用后端AI接口
  const response = await fetch("/api/ai/polish", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: selectedText })
  });

  const { result } = await response.json();

  // 将AI结果替换选中内容
  connector.callCommand(function () {
    var oDocument = Api.GetDocument();
    // 在当前选区位置插入新文本
    var oParagraph = Api.CreateParagraph();
    oParagraph.AddText(result);
    oDocument.InsertContent([oParagraph], true); // true 表示替换选区
  });
}
```

**在光标位置插入AI生成的内容**：

```javascript
async function aiGenerate(prompt) {
  const response = await fetch("/api/ai/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt })
  });

  const { result } = await response.json();

  // 将生成的内容插入光标位置
  connector.callCommand(function () {
    var oParagraph = Api.CreateParagraph();
    var oRun = Api.CreateRun();

    // 设置字体样式与文档保持一致
    oRun.AddText(result);
    oRun.SetFontFamily("SimSun");
    oRun.SetFontSize(24); // 单位是半磅，24 = 12pt

    oParagraph.AddElement(oRun);

    var oDocument = Api.GetDocument();
    oDocument.InsertContent([oParagraph]);
  });
}
```

### 4.4 流式输出的处理

如果AI接口支持流式输出（SSE），可以实现逐字显示效果。但需要注意，频繁调用 `callCommand` 会有性能开销。建议的处理方式：

*   在侧边栏先完成AI内容的流式展示
*   用户确认后一次性插入到文档中
*   或者每积累一定长度（如一个段落）后批量插入

```javascript
// 推荐：在侧边栏展示完整结果后，一次性插入
function insertAiResult(text) {
  const paragraphs = text.split("\n").filter(p => p.trim());

  connector.callCommand(function () {
    var aContent = [];

    for (var i = 0; i < paragraphs.length; i++) {
      var oParagraph = Api.CreateParagraph();
      oParagraph.AddText(paragraphs[i]);
      aContent.push(oParagraph);
    }

    var oDocument = Api.GetDocument();
    oDocument.InsertContent(aContent);
  });
}
```



## 五、场景三：Excel报表自动生成

### 5.1 业务需求

某数据分析平台需要将统计数据自动填入Excel模板并生成图表：

*   每月自动生成销售报表
*   将数据库中的统计数据写入对应的单元格
*   根据数据自动更新图表
*   生成后的报表可以供用户在线查看和下载

### 5.2 写入表格数据

```javascript
// 销售数据
const salesData = [
  { month: "1月", revenue: 125000, cost: 89000, profit: 36000 },
  { month: "2月", revenue: 138000, cost: 92000, profit: 46000 },
  { month: "3月", revenue: 156000, cost: 98000, profit: 58000 },
  // ...
];

function fillExcelReport(connector, data) {
  // 将数据转为JSON字符串，嵌入到函数中
  const jsonStr = JSON.stringify(data);

  connector.callCommand(function () {
    var data = JSON.parse(jsonStr);
    var oWorksheet = Api.GetActiveSheet();

    // 写入表头
    oWorksheet.GetRange("A1").SetValue("月份");
    oWorksheet.GetRange("B1").SetValue("收入(元)");
    oWorksheet.GetRange("C1").SetValue("成本(元)");
    oWorksheet.GetRange("D1").SetValue("利润(元)");

    // 设置表头样式
    var headerRange = oWorksheet.GetRange("A1:D1");
    headerRange.SetBold(true);
    headerRange.SetFillColor(Api.CreateColorFromRGB(68, 114, 196));
    headerRange.SetFontColor(Api.CreateColorFromRGB(255, 255, 255));

    // 写入数据
    for (var i = 0; i < data.length; i++) {
      var row = i + 2;
      oWorksheet.GetRange("A" + row).SetValue(data[i].month);
      oWorksheet.GetRange("B" + row).SetValue(data[i].revenue);
      oWorksheet.GetRange("C" + row).SetValue(data[i].cost);
      oWorksheet.GetRange("D" + row).SetValue(data[i].profit);
    }

    // 设置数字格式
    var dataRows = data.length;
    oWorksheet.GetRange("B2:D" + (dataRows + 1)).SetNumberFormat("#,##0.00");

    // 自动调整列宽
    oWorksheet.GetRange("A1:D1").SetColumnWidth(15);
  });
}
```

### 5.3 自动创建图表

```javascript
function createChart(connector, dataRowCount) {
  connector.callCommand(function () {
    var oWorksheet = Api.GetActiveSheet();

    // 创建柱状图
    var oChart = oWorksheet.AddChart(
      "'" + oWorksheet.GetName() + "'!$A$1:$D$" + (dataRowCount + 1),
      true,  // 按行
      "bar", // 图表类型
      2,     // 样式
      200 * 36000,   // 宽度（EMU）
      150 * 36000    // 高度（EMU）
    );

    oChart.SetTitle("月度销售报表", 12);
    oChart.SetLegendPos("bottom");

    // 将图表放置在数据下方
    oChart.SetPosition(oWorksheet, dataRowCount + 3, 0, 0, 0);
  });
}
```

### 5.4 完整工作流

```javascript
async function generateMonthlyReport() {
  // 1. 从后端获取数据
  const response = await fetch("/api/reports/monthly-sales");
  const salesData = await response.json();

  // 2. 创建连接器
  const connector = docEditor.createConnector();

  // 3. 填充数据
  fillExcelReport(connector, salesData);

  // 4. 生成图表
  createChart(connector, salesData.length);

  // 5. 通知用户
  showNotification("报表生成完成");
}
```



## 六、连接器开发的最佳实践

### 6.1 数据传递

由于 `callCommand` 中的函数在编辑器沙箱中执行，不能直接引用外部变量。推荐的数据传递方式：

```javascript
// 方式一：将数据序列化后拼接到函数体中
function setValueByConnector(connector, cellRef, value) {
  const safeValue = JSON.stringify(value);
  connector.callCommand(
    new Function(`
      var oSheet = Api.GetActiveSheet();
      oSheet.GetRange("${cellRef}").SetValue(${safeValue});
    `)
  );
}

// 方式二：使用 callCommand 的回调获取返回值
connector.callCommand(
  function () {
    return Api.GetDocument().GetStatistics();
  },
  false,
  function (stats) {
    console.log("文档统计:", stats);
  }
);
```

### 6.2 错误处理

```javascript
function safeCallCommand(connector, fn, callback) {
  try {
    connector.callCommand(fn, false, function (result) {
      if (callback) callback(null, result);
    });
  } catch (error) {
    console.error("连接器调用失败:", error);
    if (callback) callback(error, null);
  }
}
```

### 6.3 性能优化

*   **批量操作**：将多个操作合并到一次 `callCommand` 调用中，减少通信开销
*   **避免频繁调用**：不要在循环中逐次调用 `callCommand`，应在单次调用中完成所有操作
*   **异步处理**：`callCommand` 是异步的，注意操作顺序的控制

```javascript
// 不推荐：逐行调用
for (let i = 0; i < 1000; i++) {
  connector.callCommand(function () {
    // 写入一行数据
  });
}

// 推荐：一次性写入所有数据
connector.callCommand(function () {
  var oSheet = Api.GetActiveSheet();
  for (var i = 0; i < 1000; i++) {
    oSheet.GetRange("A" + (i + 1)).SetValue("data" + i);
  }
});
```

### 6.4 动态权限切换（中国版特有）

中国版自 `9.3.0` 版本开始支持通过连接器动态修改用户权限，无需重新打开文档即可实时生效。

**使用场景**：
*   审批流程中，审批人点击"开始审批"后自动切换为只读模式
*   文档状态变化时，动态调整用户的编辑/复制/打印权限
*   根据业务规则，在特定条件下限制用户操作

**实现示例**：

```javascript
// 创建连接器
const connector = docEditor.createConnector();

// 审批人点击"开始审批"按钮时，切换为只读+可评论
function onStartReview() {
  connector.callCommand(function () {
    Api.changePermissions({
      edit: false,
      comment: true,
      copy: true,
      copyOut: false,
      print: false
    });
  });
}

// 审批通过后，进入签署阶段，完全禁止操作
function onApproved() {
  connector.callCommand(function () {
    Api.changePermissions({
      edit: false,
      comment: false,
      copy: false,
      copyOut: false,
      print: false
    });
  });
}

// 审批驳回，退回给起草人编辑
function onRejected() {
  connector.callCommand(function () {
    Api.changePermissions({
      edit: true,
      comment: true,
      copy: true,
      copyOut: true,
      print: true
    });
  });
}
```

**支持的权限字段**：

| 字段    | 说明                             | 类型    |
| ------- | -------------------------------- | ------- |
| comment | 是否允许评论                     | Boolean |
| copy    | 是否允许复制                     | Boolean |
| copyOut | 是否允许复制到外部（中国版特有） | Boolean |
| edit    | 是否允许编辑                     | Boolean |
| print   | 是否允许打印                     | Boolean |

> **注意**：动态权限切换为高级版功能，目前仅支持 Word/Excel/PPT 的 PC 模式

### 6.5 与中国版增强功能的配合

连接器可以与中国版的多个增强功能组合使用，构建更强大的业务场景：

| 组合方式              | 典型场景                         | 关键配置                          |
| :-------------------- | :------------------------------- | :-------------------------------- |
| 连接器 + 用户只读模式 | 合同制作、公文套打               | `customization.readOnly: true`    |
| 连接器 + 动态权限切换 | 审批流程中的权限流转             | `Api.changePermissions()`         |
| 连接器 + 防截图水印   | 安全环境下的自动文档生成         | `customization.waterMark`         |
| 连接器 + 内部剪切板   | 敏感数据填充后防止用户复制到外部 | `permissions.copyOut: false`      |
| 连接器 + 迷你工具栏   | 简化用户编辑体验                 | `customization.miniToolbar: true` |



## 七、与WPS JSSDK的对比

对于有国内办公套件集成经验的开发者，可能更熟悉 WPS 的 JSSDK。以下是两者的关键差异：

| 对比维度         | OnlyOffice 连接器               | WPS JSSDK                    |
| :--------------- | :------------------------------ | :--------------------------- |
| **API丰富度**    | 与插件接口相同，覆盖面广        | 提供标准化接口，覆盖常用场景 |
| **文档操作深度** | 可操作到段落、Run、样式等细粒度 | 以高层封装为主               |
| **私有化部署**   | 完全支持                        | 需要商业授权                 |
| **学习成本**     | 需了解 OOXML 模型               | 接口设计更面向业务           |
| **扩展性**       | 插件 + 连接器双通道             | SDK标准接口                  |

OnlyOffice 连接器的优势在于更深的文档操作能力和完全的私有化支持，适合需要深度定制的企业级场景。



## 八、总结

OnlyOffice 中国版的连接器为业务系统与文档编辑器之间架起了一座桥梁。通过 JSAPI，外部系统可以像操作数据库一样操作文档内容——读取、写入、格式化、生成图表，一切都可以通过代码完成。

核心价值：
*   **合同生成**：模板 + 数据 = 标准合同，告别手工填写
*   **AI写作**：大模型生成的内容无缝融入文档编辑流程
*   **报表自动化**：数据驱动的文档生成，取代重复的手工操作
*   **流程驱动**：文档操作与业务流程深度绑定，实现真正的自动化

> **连接器让 OnlyOffice 不再只是一个编辑器，而是业务系统中可编程的文档引擎。**

## 相关资源

*   OnlyOffice 连接器官方文档：[https://api.onlyoffice.com/docs/docs-api/usage-api/automation-api/](https://api.onlyoffice.com/docs/docs-api/usage-api/automation-api/)
*   插件与宏代码示例：[https://api.onlyoffice.com/docs/plugin-and-macros/customization/context-menu/](https://api.onlyoffice.com/docs/plugin-and-macros/customization/context-menu/)
*   OnlyOffice最新版本9.x镜像：[https://onlyoffice.moqisoft.com/docs/install/docker](https://onlyoffice.moqisoft.com/docs/install/docker)
*   OnlyOffice 中国版技术交流：[https://qm.qq.com/q/YzEIuNe1yy](https://qm.qq.com/q/YzEIuNe1yy)
