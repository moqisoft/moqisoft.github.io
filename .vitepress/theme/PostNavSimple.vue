<script setup>
import { computed } from 'vue'
import { useRoute } from 'vitepress'
import { data as posts } from '../posts.data'

const route = useRoute()

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

// 上一篇（索引 +1，因为按日期倒序）
const prevPost = computed(() => {
  if (currentIndex.value === -1 || currentIndex.value >= sortedPosts.value.length - 1) return null
  return sortedPosts.value[currentIndex.value + 1]
})

// 下一篇（索引 -1）
const nextPost = computed(() => {
  if (currentIndex.value <= 0) return null
  return sortedPosts.value[currentIndex.value - 1]
})
</script>

<template>
  <div v-if="prevPost || nextPost" class="post-nav-simple">
    <div v-if="prevPost" class="nav-item">
      <a :href="prevPost.url" class="nav-link">
        <span class="arrow">←</span>
        <span class="label">上一篇：</span>
        <span class="title">{{ prevPost.title }}</span>
      </a>
    </div>
    <div v-if="nextPost" class="nav-item">
      <a :href="nextPost.url" class="nav-link">
        <span class="label">下一篇：</span>
        <span class="title">{{ nextPost.title }}</span>
        <span class="arrow">→</span>
      </a>
    </div>
  </div>
</template>

<style scoped>
.post-nav-simple {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--vp-c-divider);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.nav-item {
  flex: 1;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.25rem;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  text-decoration: none;
  color: var(--vp-c-text-1);
  transition: all 0.2s ease;
  border: 1px solid var(--vp-c-divider);
}

.nav-link:hover {
  border-color: var(--vp-c-brand);
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand);
  transform: translateX(4px);
}

.arrow {
  font-size: 1.2rem;
  color: var(--vp-c-brand);
}

.label {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  white-space: nowrap;
}

.title {
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (min-width: 768px) {
  .post-nav-simple {
    flex-direction: row;
  }
  
  .nav-link {
    justify-content: space-between;
  }
  
  .nav-item:last-child .nav-link {
    justify-content: flex-end;
  }
}
</style>
