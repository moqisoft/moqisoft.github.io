<template>
  <div class="custom-content" ref="container">
    <!-- 豆腐块 -->
    <ins class="adsbygoogle" style="display: block" data-ad-client="ca-pub-7016841222608649" data-ad-slot="7278406904"
      data-ad-format="auto" data-full-width-responsive="true"></ins>
  </div>
</template>

<style scoped>
.custom-content {
  font-size: 14px;
  line-height: 1.6;
}
</style>

<script>
export default {
  mounted() {
    // 确保广告脚本已加载
    if (typeof window !== 'undefined' && window.adsbygoogle) {
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    }
  }
}
</script>
