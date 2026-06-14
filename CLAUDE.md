# ビビリ映画部 — Claude Code 引き継ぎメモ

## プロジェクト概要

- サイト名：ビビリ映画部（bibiri-movie-club）
- URL：https://motojiro888.github.io/bibiri-movie-club/
- GitHub：motojiro888 / bibiri-movie-club
- フレームワーク：Astro（静的サイト）
- ホスティング：GitHub Pages
- デプロイ：`npm run deploy`（gh-pages パッケージ）

---

## ディレクトリ構成（主要部分）

```
src/
  data/
    reviews/
      index.js          ← 全レビューのimport/exportバレル
      hereditary.js     ← 個別レビューデータ（詳細）
      midsommar.js
      ... （1映画 = 1ファイル）
    reviews.js          ← カード表示用フラット配列（一覧・フィルター用）
  pages/
    reviews/
      [id].astro        ← 詳細ページ（動的ルーティング）
      index.astro       ← レビュー一覧ページ
    index.astro         ← トップページ
  layouts/
    BaseLayout.astro

public/
  assets/
    images/
      *.webp            ← 映画サムネイル
      motojiro-*.png    ← マスコットキャラ画像
```

---

## レビュー追加の手順（3ファイル更新）

新しい映画レビューを追加するときは、必ず以下の3ファイルをすべて更新する。

### ① `src/data/reviews/[film-id].js`（詳細データ）

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

---

### ② `src/data/reviews/index.js`（バレルファイル）

import と export の配列に1行ずつ追加する。**順番は publishedAt の昇順が望ましい。**

```js
import { filmId } from './film-id.js';   // 追加
export const reviews = [..., filmId];     // 配列末尾に追加
```

---

### ③ `src/data/reviews.js`（カード用フラット配列）

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

---

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

---

## ソート順のルール

- `reviews.js` の配列順 = 一覧ページの表示順
- ソートキーは `publishedAt`（編集時の `updatedAt` 変更で順番が変わらないようにするため）
- 新しい映画は配列の末尾に追加する

---

## 禁止事項（詳細ページ `[id].astro`）

- class名の変更・追加
- CSS の追加
- 既存 section の id・class の変更
- 不要な div の追加
- `section-spoiler` ブロックの追加（永久に除外）
- `motojiro-block`（verdict セクション）の追加（除外済み）

### 詳細ページのセクション構成（この順番を維持）

1. `#section-fear` — 恐怖の性質
2. `#section-animal` — 動物の安否
3. `#section-guide` — 防衛タイムスタンプ
4. `#section-fit` — 向いてる人/向いてない人
5. `#section-info` — 作品情報

---

## BASE_URL の扱い

```js
const base = import.meta.env.BASE_URL;
// BASE_URL は末尾スラッシュなし → "/bibiri-movie-club"

// 正しい書き方
`${base}/assets/images/foo.webp`   // ✅
`${base}assets/images/foo.webp`    // ❌（スラッシュ抜け）
```

---

## よくある作業パターン

### 新規レビュー追加（Claude Code への指示例）

```
以下の映画のレビューを追加してください。
- id: xxx
- title: xxx
（データを渡す）

更新するファイル：
1. src/data/reviews/xxx.js を新規作成
2. src/data/reviews/index.js にimportとexportを追加
3. src/data/reviews.js の配列末尾にカードデータを追加
```

### 既存レビューの修正

```
src/data/reviews/xxx.js の [フィールド名] を [新しい値] に修正してください。
updatedAt も今日の日付（YYYY-MM-DD）に更新してください。
※ reviews.js 側も該当フィールドがあれば同様に更新してください。
```

---

## デプロイ

```bash
npm run deploy
```

GitHub Pages に自動デプロイされる。ビルド成果物は `dist/` に出力され、`gh-pages` ブランチにプッシュされる。

---

## あらすじ（synopsis）のルール

- ネタバレなし
- 150字以内
- 日本語

---

## レビュー管理CSV（reviews-list.csv）のルール

レビューを追加・更新するたびに、プロジェクトルートの
reviews-list.csv も必ず更新すること。

カラム順：
タイトル, 公開状況, 公開日, 更新日, ジャンル1, ジャンル2, びっくり度, グロ度, 精神ダメージ, 動物安否, 映画公開年, 上映時間（分）, URL

- 公開状況は空欄のままにする
- URLは https://motojiro888.github.io/bibiri-movie-club/reviews/[id]/

