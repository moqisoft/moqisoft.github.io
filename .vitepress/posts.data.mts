// docs/.vitepress/posts.data.ts
import { createContentLoader } from "vitepress";

export default createContentLoader("posts/*.md", {
  // 只抓取 posts 目录下的文章，排除 index.md 本身
  includeSrc: false,
  render: false,
  excerpt: true,

  transform(rawData) {
    return (
      rawData
        .filter(({ url }) => url !== "/posts/") // 排除列表页本身
        .map(({ url, frontmatter, excerpt }) => ({
          title: frontmatter.title,
          date: frontmatter.date,
          // 格式化日期为更友好的显示
          formattedDate: frontmatter.date
            ? new Date(frontmatter.date).toLocaleDateString("zh-CN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : null,
          tags: frontmatter.tags || [],
          description: frontmatter.description,
          url,
          excerpt,
        }))
        // 按日期倒序排列（最新的在前）
        .sort((a, b) => {
          if (!a.date) return 1;
          if (!b.date) return -1;
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        })
    );
  },
});
