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

// 使用字符串连接避免出现完整的 </script> 标签
const htmlContent = `
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7016841222608649"
     crossorigin="anonymous"></` + `script>
<!-- 豆腐块 -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-7016841222608649"
     data-ad-slot="7278406904"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</` + `script>`;

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