// .vitepress/theme/index.js
import DefaultTheme from "vitepress/theme";
import { onMounted, watch, nextTick } from "vue";
import { useRoute, inBrowser } from "vitepress";
import "./custom.css";

export default {
  ...DefaultTheme,
  setup() {
    const route = useRoute();
    const initZoom = async () => {
      if (inBrowser) {
        await import("medium-zoom").then((module) => {
          const mediumZoom = module.default;
          mediumZoom(".main img", { background: "var(--vp-c-bg)" });
        });
      }
    };
    onMounted(() => {
      initZoom();
    });
    watch(
      () => route.path,
      () => nextTick(() => initZoom())
    );
  },
};
