import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import fg from 'fast-glob';
import type { Plugin } from 'vite';

interface IPost {
  title: string;
  datetime: string;
  permalink: string;
  excerpt?: string;
}

export function postsPlugin(): Plugin {
  let posts: IPost[] = [];

  return {
    name: 'vitepress-posts-data',
    async buildStart() {
      // 读取 posts 目录
      const paths = await fg('posts/**/*.md');

      posts = paths.map((postPath) => {
        const { data, excerpt, content } = matter.read(postPath, {
          excerpt: true,
          excerpt_separator: '<!-- more -->',
        });

        const post = data as IPost;

        // 如果没有 excerpt,从 content 中生成
        if (!excerpt && content) {
          const plainText = content
            .replace(/```.*?```/gs, '')
            .replace(/^#+\s.*$/gm, '')
            .replace(/^>.*$/gm, '')
            .trim()
            .split(/\r\n|\n|\r/)
            .join(' ')
            .replace(/\s{2,}/g, ' ')
            .slice(0, 150);
          post.excerpt = plainText;
        } else {
          post.excerpt = excerpt || '';
        }

        return post;
      })
        .filter((post) => post.display !== 'none')
        .sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime());
    },

    configureServer(server: any) {
      server.middlewares.use('/api/posts.json', (req: any, res: any) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(posts));
      });
    },
  };
}
