import { getCollection } from 'astro:content';
import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import { getReviews } from './reviews.js';

const SUMMARY_HEADING = '総評';

// Markdown 内の改行をそのまま <br> にする（日本語の文章を1行ずつ改行して書けるように）
function remarkLineBreaks() {
  const walk = node => {
    if (!node.children) return;
    node.children = node.children.flatMap(child => {
      if (child.type !== 'text' || !child.value.includes('\n')) {
        walk(child);
        return [child];
      }
      return child.value
        .split('\n')
        .flatMap((value, i) => (i ? [{ type: 'break' }, { type: 'text', value }] : [{ type: 'text', value }]));
    });
  };
  return tree => walk(tree);
}

let processor;
async function renderMarkdown(md) {
  processor ??= await createMarkdownProcessor({
    remarkPlugins: [remarkLineBreaks],
    smartypants: false,
    syntaxHighlight: false,
  });
  return (await processor.render(md)).code;
}

// 段落が1つだけなら <p> を外す（吹き出しの中にそのまま入れるため）
function unwrapSingleParagraph(html) {
  const m = html.trim().match(/^<p>([\s\S]*)<\/p>$/);
  return m && !m[1].includes('</p>') ? m[1] : html;
}

// meta description や一覧の抜粋用に、Markdown 記法を外す
function toPlainText(md) {
  return md.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/\*\*|__|`/g, '');
}

/**
 * 全まとめ記事を公開日の新しい順で返す
 * 本文は「イントロ → ## 作品ID（1つ以上）→ ## 総評」の順で書く
 * @returns {Promise<Array>}
 */
export async function getArticles() {
  const [entries, reviews] = await Promise.all([getCollection('articles'), getReviews()]);
  const reviewIds = new Set(reviews.map(r => r.id));
  const articles = [];

  for (const entry of entries) {
    const fail = msg => {
      throw new Error(`まとめ記事 ${entry.id}.md：${msg}`);
    };

    // split に見出しのキャプチャを入れると [イントロ, 見出し1, 本文1, 見出し2, 本文2, ...] になる
    const [intro, ...rest] = entry.body.split(/^## +(.+?) *\r?$/m);
    const sections = [];
    for (let i = 0; i < rest.length; i += 2) {
      sections.push({ heading: rest[i].trim(), body: rest[i + 1].trim() });
    }

    if (!intro.trim()) fail('イントロ（最初の「##」より前の文章）がありません');
    const summary = sections.at(-1);
    if (summary?.heading !== SUMMARY_HEADING) fail(`最後の見出しは「## ${SUMMARY_HEADING}」にしてください`);
    const films = sections.slice(0, -1);
    if (films.length === 0) fail('「## 作品ID」の見出しが1つもありません');

    const seen = new Set();
    for (const s of sections) {
      if (!s.body) fail(`「## ${s.heading}」の下に文章がありません`);
    }
    for (const f of films) {
      if (!reviewIds.has(f.heading)) fail(`「## ${f.heading}」というレビューはありません（見出しは作品IDで書いてください）`);
      if (seen.has(f.heading)) fail(`「## ${f.heading}」が2回出てきます`);
      seen.add(f.heading);
    }
    for (const rec of entry.data.recommendations) {
      if (!seen.has(rec.filmId)) fail(`recommendations の ${rec.filmId} が、記事で紹介している作品に入っていません`);
    }

    articles.push({
      id: entry.id,
      ...entry.data,
      intro: toPlainText(intro.trim()),
      introHtml: await renderMarkdown(intro),
      filmIds: films.map(f => f.heading),
      filmComments: await Promise.all(films.map(async f => ({ id: f.heading, html: await renderMarkdown(f.body) }))),
      motojiroHtml: unwrapSingleParagraph(await renderMarkdown(summary.body)),
    });
  }

  return articles.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}
