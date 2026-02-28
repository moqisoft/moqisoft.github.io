<script setup>
import { computed } from 'vue'
import { useRoute, useData } from 'vitepress'
import { data as posts } from '../posts.data'

const route = useRoute()
const { page } = useData()

// 判断当前是否在posts详情页
const isPostPage = computed(() => {
  return route.path.startsWith('/posts/') && route.path !== '/posts/'
})

// 获取排序后的文章列表
const sortedPosts = computed(() => {
  return [...posts]
    .filter(post => post.url !== '/posts/')
    .sort((a, b) => {
      if (!a.date) return 1
      if (!b.date) return -1
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
})

// 找到当前文章索引
const currentIndex = computed(() => {
  return sortedPosts.value.findIndex(post => post.url === route.path)
})

// 上一篇（索引+1，因为按日期倒序）
const prevPost = computed(() => {
  if (currentIndex.value === -1 || currentIndex.value >= sortedPosts.value.length - 1) return null
  return sortedPosts.value[currentIndex.value + 1]
})

// 下一篇（索引-1）
const nextPost = computed(() => {
  if (currentIndex.value <= 0) return null
  return sortedPosts.value[currentIndex.value - 1]
})
</script>

<template>
  <div v-if="isPostPage && (prevPost || nextPost)" class="post-nav">
    <div class="post-nav-container">
      <!-- 上一篇 -->
      <a 
        v-if="prevPost" 
        :href="prevPost.url" 
        class="post-nav-item post-nav-prev"
      >
        <div class="post-nav-label">
          <span class="post-nav-arrow">←</span>
          <span>上一篇</span>
        </div>
        <div class="post-nav-title">{{ prevPost.title }}</div>
      </a>
      <div v-else class="post-nav-item post-nav-empty"></div>
      
      <!-- 下一篇 -->
      <a 
        v-if="nextPost" 
        :href="nextPost.url" 
        class="post-nav-item post-nav-next"
      >
        <div class="post-nav-label">
          <span>下一篇</span>
          <span class="post-nav-arrow">→</span>
        </div>
        <div class="post-nav-title">{{ nextPost.title }}</div>
      </a>
      <div v-else class="post-nav-item post-nav-empty"></div>
    </div>
  </div>
</template>

<style scoped>
.post-nav {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--vp-c-divider);
  max-width: 860px;
  margin-left: auto;
  margin-right: auto;
}

.post-nav-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.post-nav-item {
  display: flex;
  flex-direction: column;
  padding: 1rem 1.25rem;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  text-decoration: none;
  transition: all 0.3s ease;
  background: var(--vp-c-bg-soft);
}

.post-nav-item:hover {
  border-color: var(--vp-c-brand);
  background: var(--vp-c-bg);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.post-nav-prev {
  text-align: left;
}

.post-nav-next {
  text-align: right;
  margin-left: auto;
}

.post-nav-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  margin-bottom: 0.5rem;
}

.post-nav-arrow {
  font-size: 1rem;
  color: var(--vp-c-brand);
}

.post-nav-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.post-nav-empty {
  visibility: hidden;
}

/* 移动端适配 */
@media (max-width: 640px) {
  .post-nav-container {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  
  .post-nav-next {
    margin-left: 0;
    text-align: left;
  }
  
  .post-nav-next .post-nav-label {
    flex-direction: row-reverse;
    justify-content: flex-end;
  }
  
  .post-nav-item {
    padding: 0.875rem 1rem;
  }
  
  .post-nav-title {
    font-size: 0.95rem;
  }
}
</style>