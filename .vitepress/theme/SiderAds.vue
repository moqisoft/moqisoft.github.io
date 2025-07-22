<template>
  <div class="custom-content" ref="container"></div>
</template>

<style scoped>
.custom-content {
  font-size: 14px;
  line-height: 1.6;
}
</style>

<script setup>
import { ref, onMounted } from "vue";

const container = ref(null);

const htmlContent = `<amp-ad width="100vw" height="320"
     type="adsense"
     data-ad-client="ca-pub-7016841222608649"
     data-ad-slot="7278406904"
     data-auto-format="rspv"
     data-full-width="">
  <div overflow=""></div>
</amp-ad>`;

onMounted(() => {
  if (container.value) {
    // 插入HTML
    container.value.innerHTML = htmlContent;

    // 手动查找并执行所有script标签
    const scripts = container.value.querySelectorAll("script");
    scripts.forEach((oldScript) => {
      const newScript = document.createElement("script");
      Array.from(oldScript.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value);
      });
      newScript.textContent = oldScript.textContent;
      oldScript.parentNode.replaceChild(newScript, oldScript);
    });
  }
});
</script>
