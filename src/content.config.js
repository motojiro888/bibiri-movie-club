import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// レビューデータのルール。src/content/reviews/[id].yaml を1作品1ファイルで置く。
// ルールに合わないデータがあると、ビルド（npm run deploy）がエラーで止まる。

const score = z.number().int().min(1).max(5);
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD 形式で書いてください');

const ANIMAL_LABEL = { safe: '✅ 安全', warn: '⚠️ 注意', danger: '❌ 危険' };

// fearCards は必ずこの順番で4枚
const fearCard = (icon, title) =>
  z.strictObject({
    icon: z.literal(icon),
    title: z.literal(title),
    score,
    body: z.string().min(1),
  });

// timestamps は3モード（.clauderules/timestamps.md）
const timestamp = z.union([
  z.strictObject({
    time: z.string().min(1),
    text: z.string().min(1),
    level: z.enum(['high', 'mid', 'low']),
  }),
  z.strictObject({ type: z.literal('pattern'), text: z.string().min(1) }),
  z.strictObject({ type: z.literal('none') }),
]);

const reviews = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/reviews' }),
  schema: z
    .strictObject({
      title: z.string().min(1),
      titleEn: z.string().min(1),
      year: z.number().int(),
      genres: z.array(z.string().min(1)).min(1),
      difficulty: z.enum(['beginner', 'mid', 'advanced']),
      animal: z.enum(['safe', 'warn', 'danger']),
      animalLabel: z.enum(Object.values(ANIMAL_LABEL)),
      animalDesc: z.string().min(1),
      bikkuri: score,
      guro: score,
      image: z.string().regex(/^\/assets\/images\/[a-z0-9-]+\.webp$/, '/assets/images/[id].webp 形式で書いてください'),
      motojiroImg: z.enum([
        '/assets/images/motojiro-soul-out.png',
        '/assets/images/motojiro-shocked.png',
        '/assets/images/motojiro-scared.png',
        '/assets/images/motojiro-sweating.png',
        '/assets/images/motojiro-excited.png',
      ]),
      motojiroAlt: z.string().min(1),
      publishedAt: date,
      updatedAt: date,
      // 一覧で公開日が同じ作品どうしの並び順（小さいほど上）。新作は最大値+1
      sortOrder: z.number().int().positive(),
      synopsis: z.string().min(1).max(150),
      meta: z.strictObject({
        runtime: z.number().int().positive(),
        genre: z.string().min(1),
        country: z.string().min(1),
        director: z.string().min(1),
        cast: z.string().min(1),
      }),
      verdict: z.string().min(1),
      fearCards: z.tuple([
        fearCard('😱', 'びっくり度'),
        fearCard('🩸', 'グロ度'),
        fearCard('🧠', '精神ダメージ'),
        fearCard('🌃', '日常侵食度'),
      ]),
      // 空配列は詳細ページで「準備中」と表示される
      timestamps: z.array(timestamp),
      motojiroComment: z.string().min(1),
      fitOk: z.array(z.string().min(1)).min(1),
      fitNg: z.array(z.string().min(1)).min(1),
    })
    .superRefine((r, ctx) => {
      if (r.animalLabel !== ANIMAL_LABEL[r.animal]) {
        ctx.addIssue({ code: 'custom', path: ['animalLabel'], message: `animal が ${r.animal} のときは「${ANIMAL_LABEL[r.animal]}」にしてください` });
      }
      if (r.bikkuri !== r.fearCards[0].score) {
        ctx.addIssue({ code: 'custom', path: ['bikkuri'], message: 'fearCards の「びっくり度」のスコアと一致させてください' });
      }
      if (r.guro !== r.fearCards[1].score) {
        ctx.addIssue({ code: 'custom', path: ['guro'], message: 'fearCards の「グロ度」のスコアと一致させてください' });
      }
      if (r.updatedAt < r.publishedAt) {
        ctx.addIssue({ code: 'custom', path: ['updatedAt'], message: 'publishedAt より前の日付になっています' });
      }
      if (r.timestamps.some(t => t.type === 'none') && r.timestamps.length > 1) {
        ctx.addIssue({ code: 'custom', path: ['timestamps'], message: "type: none は1件だけで使ってください" });
      }
    }),
});

export const collections = { reviews };
