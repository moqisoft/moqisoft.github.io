<template>
  <div class="latest-posts">
    <h2>📚 最新文章</h2>
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="latestPosts.length === 0" class="no-posts">暂无文章</div>
    <div v-else class="posts-grid">
      <a v-for="post in latestPosts" :key="post.permalink" :href="post.permalink" class="post-item">
        <div class="post-title">{{ post.title }}</div>
        <div class="post-excerpt">{{ post.excerpt }}</div>
        <div class="post-meta">
          <span class="post-date">{{ formatDate(post.datetime) }}</span>
        </div>
      </a>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';

const latestPosts = ref<any[]>([]);
const loading = ref(true);

onMounted(async () => {
  try {
    // 从 API 获取文章数据
    const response = await fetch('/api/posts.json');
    if (response.ok) {
      const data = await response.json();
      // 取最新的 3 篇文章 (已经按日期排序)
      latestPosts.value = data.slice(0, 3);
    }
  } catch (error) {
    console.error('Failed to load posts:', error);
  } finally {
    loading.value = false;
  }
});

const formatDate = (datetime: string) => {
  if (!datetime) return '';
  return datetime.split(' ')[0];
};
</script>

<style lang="less" scoped>
.latest-posts {
  max-width: 1152px;
  margin: 60px auto 40px;
  padding: 0 24px;
}

.latest-posts h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 24px;
  color: var(--vp-c-text-1);
}

.latest-posts .posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.latest-posts .post-item {
  padding: 20px;
  border-radius: 12px;
  background-color: var(--vp-c-bg-soft);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
  text-decoration: none;
  color: var(--vp-c-text-1);
  display: block;
}

.latest-posts .post-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  background-color: var(--vp-c-bg-soft-hover);
}

.latest-posts .post-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: var(--vp-c-text-1);
  line-height: 1.5;
}

.latest-posts .post-excerpt {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.latest-posts .post-meta {
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
}

.latest-posts .post-date {
  margin-right: 16px;
}

.loading, .no-posts {
  text-align: center;
  padding: 40px;
  color: var(--vp-c-text-3);
}

@media (max-width: 768px) {
  .latest-posts {
    margin: 40px auto;
  }

  .latest-posts .posts-grid {
    grid-template-columns: 1fr;
  }
}
</style>
