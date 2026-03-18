import { defineConfig } from "vitepress";
import { usePosts } from "../src/composables/usePosts";
import type { ThemeConfig } from "../src/types";
import { postsPlugin } from "./plugin/postsPlugin";

const { posts, rewrites } = await usePosts({
  pageSize: 6,
  homepage: false,
  srcDir: "posts",
  autoExcerpt: 150,
  prev: true,
  next: true,
});

export default defineConfig<ThemeConfig>({
  vite: {
    server: {
      host: "127.0.0.1",
      port: 5273,
    },
    plugins: [postsPlugin()],
  },
  sitemap: {
    hostname: "https://onlyoffice.moqisoft.com",
  },
  base: "/",
  cleanUrls: true,
  outDir: "./dist",
  lang: "zh-CN",
  title: "onlyoffice文档服务中国版，中文办公专家",
  description:
    "onlyoffice中文版, documentserver社区版增强, 中文weboffice专家. 部署简单, word在线编辑, 即开即用",
  head: [
    [
      "meta",
      { name: "google-adsense-account", content: "ca-pub-7016841222608649" },
    ],
    ["meta", { name: "baidu-site-verification", content: "codeva-rt8FUjktiP" }],
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
  rewrites,
  ignoreDeadLinks: true,
  lastUpdated: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    posts,
    logo: "",
    siteTitle: "onlyoffice文档服务中国版",
    search: {
      provider: "local",
      options: {},
    },

    nav: [
      { text: "首页", link: "/" },
      { text: "产品介绍", link: "/docs/product/summary" },
      { text: "版本比较", link: "/docs/product/compare" },
      { text: "常见问题", link: "/docs/product/faq" },
      { text: "更新日志", link: "/docs/product/changelog" },
      { text: "技术文章", link: "/page-1" },
      // { text: "分类", link: "/category" },
      // { text: "归档", link: "/archives" },
      { text: "联系我们", link: "/docs/product/about" },
    ],

    sidebar: {
      "/docs/": [
        {
          text: "快速上手中国版",
          collapsed: false,
          items: [
            { text: "产品介绍", link: "/docs/product/summary" },
            { text: "安装部署", link: "/docs/install/docker" },
            { text: "版本比较", link: "/docs/product/compare" },
            { text: "高级版授权", link: "/docs/product/vip" },
            
          ],
        },
        {
          text: "中国版功能增强",
          collapsed: false,
          items: [
            { text: "连接器", link: "/docs/feature/connector" },
            { text: "个性配置", link: "/docs/feature/customization" },
            { text: "WS降级", link: "/docs/feature/longpoll" },
            { text: "防截图水印", link: "/docs/feature/watermark" },
            { text: "内部剪切板", link: "/docs/feature/copyout" },
            { text: "用户只读模式", link: "/docs/feature/readonly" },
            { text: "动态切换权限", link: "/docs/feature/changepermissions" },
            { text: "管理面板", link: "/docs/feature/adminpanel" },
          ],
        },
        // {
        //   text: "增值功能/强烈推荐👍",
        //   collapsed: false,
        //   items: [
        //     { text: "⭐️本地字体/开档加速🚀", link: "/docs/feature/fivestar" },
        //   ],
        // },
        {
          text: "更多配置",
          collapsed: false,
          items: [
            { text: "集成示例", link: "/docs/product/example" },
            { text: "访问加速", link: "/docs/feature/speedup" },
            { text: "子目录部署", link: "/docs/feature/basepath" },
            { text: "安装插件", link: "/docs/feature/plugins" },
            { text: "安装字体", link: "/docs/feature/fonts" },
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
      copyright: `Copyright © ${new Date().getFullYear()} <a href="https://onlyoffice.moqisoft.com" target="_blank">moqisoft.com</a>`,
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
  markdown: {
    lineNumbers: true,
    config: (md) => {
      md.use((md) => {
        md.renderer.rules.heading_close = (tokens, idx, options, env, slf) => {
          let htmlResult = slf.renderToken(tokens, idx, options);
          if (tokens[idx].tag === "h1") htmlResult += `<PostMeta />`;
          return htmlResult;
        };
      });
    },
  },
  srcExclude: ["README.md", "README_en-US.md", "**/TODO.md"],
});
