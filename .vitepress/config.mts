import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: "/",
  cleanUrls: true,
  outDir: "./dist",
  srcExclude: ["**/README.md", "**/TODO.md"],
  lang: "zh-CN",
  title: "onlyoffice文档服务中国版",
  description: "onlyoffice，office专家。部署简单，即开即用",
  // <meta name="google-adsense-account" content="ca-pub-7016841222608649">
  head: [
    [
      "meta",
      { name: "google-adsense-account", content: "ca-pub-7016841222608649" },
    ],
    [
      "meta",
      { name: "baidu-site-verification", content: "codeva-rt8FUjktiP" },
    ],
    // <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7016841222608649" crossorigin="anonymous"></script>
    // [
    //   "script",
    //   {
    //     crossorigin: "anonymous",
    //     scr: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7016841222608649",
    //   },
    // ],
    /*
    <script charset="UTF-8" id="LA_COLLECT" src="//sdk.51.la/js-sdk-pro.min.js"></script>
    <script>LA.init({id:"3Mu7syjTXsfG3ju1",ck:"3Mu7syjTXsfG3ju1"})</script>
    */
    [
      "script",
      {
        charset: "UTF-8",
        id: "LA_COLLECT",
        src: "//sdk.51.la/js-sdk-pro.min.js",
      },
    ],
    ["script", {}, `LA.init({id:"3Mu7syjTXsfG3ju1",ck:"3Mu7syjTXsfG3ju1"})`],
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: "",
    search: {
      provider: "local",
      options: {},
    },

    nav: [
      { text: "首页", link: "/" },
      { text: "产品介绍", link: "/docs/product/summary" },
      { text: "在线体验", link: "/example.html", target: "_blank" },
      { text: "联系我们", link: "/docs/product/about" },
    ],

    sidebar: {
      "/docs/": [
        {
          text: "快速上手",
          collapsed: false,
          items: [
            { text: "产品介绍", link: "/docs/product/summary" },
            { text: "安装部署", link: "/docs/install/docker" },
            { text: "版本比较", link: "/docs/product/compare" },
            { text: "高级版授权", link: "/docs/product/vip" },
            { text: "更新日志", link: "/docs/product/changelog" },
            { text: "集成示例", link: "/docs/product/example" },
            // { text: "联系我们", link: "/docs/product/about" },
            { text: "常见问题", link: "/docs/product/faq" },
          ],
        },
        {
          text: "功能增强",
          collapsed: false,
          items: [
            { text: "个性配置", link: "/docs/feature/customization" },
            { text: "安装插件", link: "/docs/feature/plugins" },
            { text: "安装字体", link: "/docs/feature/fonts" },
            { text: "连接器", link: "/docs/feature/connector" },
            { text: "WS降级", link: "/docs/feature/longpoll" },
            { text: "防截图水印", link: "/docs/feature/watermark" },
            { text: "内部剪切板", link: "/docs/feature/copyout" },
            { text: "访问加速", link: "/docs/feature/speedup" },
            { text: "管理面板", link: "/docs/feature/adminpanel" },
            { text: "子目录部署", link: "/docs/feature/basepath" },
          ],
        },
      ],
    },

    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/moqisoft/moqisoft.github.io",
      },
    ],

    footer: {
      // message:
      //   'Released under the <a href="https://github.com/vuejs/vitepress/blob/main/LICENSE">MIT License</a>.',
      copyright: "Copyright © 2025 moqisoft.com",
    },

    docFooter: {
      prev: "上一页",
      next: "下一页",
    },

    outline: {
      label: "页面导航",
      level: [2, 4],
    },

    lastUpdated: {
      text: "最后更新于",
      formatOptions: {
        dateStyle: "short",
        timeStyle: "short",
      },
    },
    lightModeSwitchTitle: "切换到浅色模式",
    darkModeSwitchTitle: "切换到深色模式",
  },
  // locales: {
  //   root: { label: "English", ...en },
  //   zh: { label: "简体中文", ...zh },
  // },
  lastUpdated: true,
  ignoreDeadLinks: true,
});
