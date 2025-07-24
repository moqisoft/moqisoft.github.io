<template>
  <div class="custom-content" ref="container">
    <ins class="adsbygoogle" style="display:block; text-align:center;" data-ad-layout="in-article"
      data-ad-format="fluid" data-ad-client="ca-pub-7016841222608649" data-ad-slot="8265019661"></ins>
  </div>
</template>

<style scoped>
.custom-content {
  /* font-size: 14px;
  line-height: 1.6; */
}
</style>

<script>
export default {
  mounted() {
    if (!window.adsbygoogle) {
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
    } else {
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    }
  }
}
</script>
