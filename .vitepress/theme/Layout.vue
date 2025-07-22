<!-- .vitepress/theme/Layout.vue -->
<script setup>
import DefaultTheme from 'vitepress/theme'

const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <!-- 在右侧导航下方插入自定义组件 -->
    <template #aside-outline-after>
      <div class="custom-container">
        <SiderAds />
      </div>
    </template>
  </Layout>
</template>

<style scoped>
.custom-container {
  margin-top: 24px;
  padding: 16px;
  border-top: 1px solid var(--vp-c-divider);
}
</style>