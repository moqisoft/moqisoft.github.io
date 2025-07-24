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
    // 确保只在客户端执行
    if (typeof window !== 'undefined') {
      // 动态创建脚本标签
      const script = document.createElement('script')
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7016841222608649'
      script.async = true
      script.crossOrigin = 'anonymous'
      document.head.appendChild(script)

      // 延迟执行广告初始化
      script.onload = () => {
        (window.adsbygoogle = window.adsbygoogle || []).push({})
      }
    }

  }
}
</script>
