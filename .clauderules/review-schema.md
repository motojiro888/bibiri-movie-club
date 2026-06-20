---
paths:
  - "src/data/reviews/**/*.js"
---

# レビュー追加・データ仕様ルール

新しい映画レビューを追加するときは、必ず以下の3ファイルをすべて更新する。

## ① `src/data/reviews/[film-id].js`（詳細データ）

```js
export const filmId = {
  id: 'film-id',                     // URLスラッグ（ハイフン区切り英数字）
  title: '日本語タイトル',
  titleEn: 'English Title',
  year: 2024,
  genres: ['ジャンル1', 'ジャンル2'],
  difficulty: 'mid',                 // beginner / mid / advanced
  animal: 'safe',                    // safe / warn / danger
  animalLabel: '✅ 安全',            // ✅ 安全 / ⚠️ 注意 / ❌ 危険
  animalDesc: '動物に関する説明文',
  bikkuri: 3,                        // 1〜5
  guro: 2,                           // 1〜5
  image: '/assets/images/film-id.webp',      // 相対パス（/bibiri-movie-club/ は不要）
  motojiroImg: '/assets/images/motojiro-excited.png',
  motojiroAlt: 'モトジロウの説明',
  publishedAt: 'YYYY-MM-DD',
  updatedAt: 'YYYY-MM-DD',
  synopsis: 'あらすじ',
  meta: {
    runtime: 110,
    genre: 'ジャンル表示文字列',
    country: '制作国',
    director: '監督名',
    cast: '主演俳優名',
  },
  verdict: '一言結論',
  fearCards: [
    { icon: '😱', title: 'びっくり度',   score: 3, body: '説明文' },
    { icon: '🩸', title: 'グロ度',       score: 2, body: '説明文' },
    { icon: '🧠', title: '精神ダメージ', score: 4, body: '説明文' },
    { icon: '🌃', title: '日常侵食度',   score: 3, body: '説明文' },
  ],
  timestamps: [
    { time: '開始30分前後', text: '説明', level: 'high' },  // high / mid / low
  ],
  motojiroComment: '本文（<strong>タグ可）',
  fitOk: ['おすすめできる人の条件'],
  fitNg: ['注意が必要な人の条件'],
};
```

**パス注意：** 詳細ファイルの `image` と `motojiroImg` は `/assets/images/...` と書く（`/bibiri-movie-club/` プレフィックスは不要）。

## ② `src/data/reviews/index.js`（バレルファイル）

import と export の配列に1行ずつ追加する。**順番は publishedAt の昇順が望ましい。**

```js
import { filmId } from './film-id.js';   // 追加
export const reviews = [..., filmId];     // 配列末尾に追加
```

## ③ `src/data/reviews.js`（カード用フラット配列）

一覧・フィルター・カード表示に使うファイル。詳細ファイルより**フィールドが少ない**。

```js
{
  id: 'film-id',
  title: '日本語タイトル',
  titleEn: 'English Title',
  year: 2024,
  genres: ['ジャンル1', 'ジャンル2'],
  difficulty: 'mid',
  animal: 'safe',
  bikkuri: 3,
  guro: 2,
  image: '/bibiri-movie-club/assets/images/film-id.webp',  // ← ここだけフルパス
  publishedAt: 'YYYY-MM-DD',
  updatedAt: 'YYYY-MM-DD',
},
```

**パス注意：** `reviews.js` の `image` は `/bibiri-movie-club/assets/images/...` とフルパスで書く。

## データ仕様まとめ

| フィールド | 型 | 値の選択肢 |
|---|---|---|
| `difficulty` | string | `beginner` / `mid` / `advanced` |
| `animal` | string | `safe` / `warn` / `danger` |
| `animalLabel` | string | `✅ 安全` / `⚠️ 注意` / `❌ 危険` |
| `bikkuri` | number | 1〜5 |
| `guro` | number | 1〜5 |
| `fearCards[].score` | number | 1〜5 |
| `timestamps[].level` | string | `high` / `mid` / `low` |

### fearCards の順番（必ずこの順番で4枚）
1. びっくり度（😱）
2. グロ度（🩸）
3. 精神ダメージ（🧠）
4. 日常侵食度（🌃）

### motojiroImg の選択肢
| ファイル名 | 使用シーン |
|---|---|
| `motojiro-soul-out.png` | 最上級のダメージ（ヘレディタリー級） |
| `motojiro-shocked.png` | 衝撃・ショック系 |
| `motojiro-scared.png` | 怖い系 |
| `motojiro-sweating.png` | 不穏・じわじわ系（最多） |
| `motojiro-excited.png` | 楽しめる・入門向け |

## あらすじ（synopsis）のルール

- ネタバレなし
- 150字以内
- 日本語
