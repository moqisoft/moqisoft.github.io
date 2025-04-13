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
      { text: "在线体验", link: "http://117.62.235.170:8114/wenqu/" },
    ],

    sidebar: {
      "/docs/": [
        {
          text: "快速上手",
          collapsed: false,
          items: [
            { text: "产品介绍", link: "/docs/product/summary" },
            { text: "安装部署", link: "/docs/install/docker" },
            { text: "标准版", link: "/docs/product/free" },
            { text: "高级版", link: "/docs/product/vip" },
          ],
        },
        {
          text: "功能增强",
          collapsed: false,
          items: [
            { text: "个性配置", link: "/docs/install/plugins" },
            { text: "安装插件", link: "/docs/install/plugins" },
            { text: "安装字体", link: "/docs/install/fonts" },
            { text: "连接器", link: "/docs/install/fonts" },
            { text: "WS降级", link: "/docs/install/fonts" },
          ],
        }
      ],
    },

    // socialLinks: [
    //   { icon: "github", link: "https://github.com/vuejs/vitepress" },
    // ],

    footer: {
      // message:
      //   'Released under the <a href="https://github.com/vuejs/vitepress/blob/main/LICENSE">MIT License</a>.',
      // copyright: "Copyright © 2025 pangnate",
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
