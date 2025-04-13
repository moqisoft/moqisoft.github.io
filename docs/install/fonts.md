<!--
 * @Author: 'killfly' '14787733+killfly@user.noreply.gitee.com'
 * @Date: 2024-12-19 16:00:19
 * @LastEditors: 'killfly' '14787733+killfly@user.noreply.gitee.com'
 * @LastEditTime: 2024-12-19 16:39:14
 * @FilePath: \official-website\docs\install\fonts.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
# 安装字体

## 准备字体文件

1. 搜索引擎查找免费非商业字体文件*.ttf 或*.ttc。
2. 需要授权的字体文件 windows 系统 C:\Windows\Fonts。

<font color=Red>备注：商业字体，存在商业侵权的风险，请谨慎使用！</font>

## 安装字体文件

1. 将字体文件*.ttf 或* *.ttc*文件，上传至 Wenqu-Office 安装部署的 服务器/home/wenqu/apps/data/server/fonts/init 目录下。

2. 登录服务器后台，命令行，执行以下内容：

   ```
   # 登录服务器，删除字体缓存
   docker exec wenqu-redis redis-cli -a 'Unicorn@2024' DEL wenqu:fonts:init
   # 重启主服务（预计2min左右）
   docker restart wenqu-server-service
   # 重启协同编辑服务
   docker restart wenqu-doc-service
   ```

3. 客户端浏览器清除缓存，以 chrome 浏览器为例：

   ```
   # 浏览器访问如下url
   chrome://settings/
   # 删除客户端浏览器缓存
   ```

![image-20241216112557782](/img/typora-user-images/image-20241216112557782.png)

![image-20241216112618105](/img/typora-user-images/image-20241216112618105.png)

## 注意事项

1. 下个版本升级后，不在需要客户端浏览器主动删除缓存。
2. 建议上传以下字体，仅作为试用（存在侵权风险）。

- C:\Windows\Fonts\宋体\宋体 常规
- C:\Windows\Fonts\Cambria Math 常规
- C:\Windows\Fonts\Wingdings 常规
- C:\Windows\Fonts\Symbol 常规

## <span id="initialFonts">出厂字体</span>

主要包括如下字体：

- 方正彩云_GBK
- 方正大标宋_GBK
- 方正粗等线_GBK
- 方正仿宋_GBK
- 方正黑体_GBK
- 方正琥珀_GBK
- 方正楷体_GBK
- 方正兰亭粗黑_GBK
- 方正兰亭细黑_GBK
- 方正兰亭黑_GBK
- 方正隶书_GBK
- 方正新书宋_GBK
- 方正书宋_GBK
- 方正舒体_GBK
- 方正宋体S-超大字符集(SIP)
- 方正魏碑_GBK
- 方正小标宋_GBK
- 方正细等线_GBK
- 方正细黑一_GBK
- 方正行楷_GBK
- 方正细圆_GBK
- 方正姚体_GBK
- 方正标雅宋_GBK
- 方正中等线_GBK
- 国标仿宋
- 国标黑体
- 国标楷体
- 国标宋体
- 国标小标宋
