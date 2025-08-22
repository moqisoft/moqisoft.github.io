# 内部剪切板 <span class="ant-tag">8.3.3+支持</span>

内部剪切板是对 `复制` 与 `粘贴` 功能做了权限加强，提供了专门的权限字段进行精细控制，可以在最大限度上对文档内容进行保护，防止泄露。

## 使用方法

内部剪切板属于权限的范围，配置位于 `document.permissions` 对象内

```json
{
  "document": {
    "permissions": {
      // 其它权限配置项
      "copyOut": true // true 或 false，默认为 true
    }
  }
}
```



## 字段含义

- 当 `copyOut` 为 `true` 时，表现与原版相同，可以通过快捷键（ctrl+c）或者右键菜单向外部复制内容
- 当 `copyOut` 为 `false` 时，快捷键（ctrl+c）或者右键菜单向的 `复制` 与 `粘贴` 功能仅限于在当前文档内部，即不能将文档内容复制到外部，也不能将外部内容粘贴到内部

> [!TIP]  
> `copyOut` 是 `copy` 下的细分权限， `copy` 是总开关，业务上需要结合使用
