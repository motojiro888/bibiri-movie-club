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

.clauderules/
  detail-page.md        ← 詳細ページ（[id].astro）の禁止事項・構成ルール
  review-schema.md       ← レビュー追加手順・データ仕様
  review-csv.md           ← reviews-list.csv 更新ルール
  timestamps.md             ← タイムスタンプ生成ルール
  comparison-style.md        ← 比較表現・擬音語ルール
  consistency-check.md        ← レビュー整合性チェック
```

レビュー関連の詳細ルールは `.clauderules/` 配下に分割している。該当ファイル（`src/data/reviews/*.js` など）を読み書きするタイミングで自動的に読み込まれる。

---

## ソート順のルール

- `reviews.js` の配列順 = 一覧ページの表示順
- ソートキーは `publishedAt`（編集時の `updatedAt` 変更で順番が変わらないようにするため）
- 新しい映画は配列の末尾に追加する

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

詳細なフィールド仕様・コード例は `.clauderules/review-schema.md` を参照。

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

**公開前確認ルール：** レビュー追加・修正作業（3ファイル更新＋`reviews-list.csv`＋`サイト改善ログ.md`）が完了した時点で作業を止める。`npm run deploy` は人間からの明示的な指示があるまで実行しない。

---

## 改善ログ自動更新ルール

- サイトに修正・変更を加えた場合、`reviews-list.csv` と同様に、`サイト改善ログ.md` への追記も指示なしで自動的に行う。
- 追記項目：日付／変更タイトル／変更の大きさ／対象ツール／変更内容／変更理由
- **変更の大きさ**は「大／中／小」の3段階で判定する。
  - 大：サイト構造・運用フロー自体が変わる規模の変更
  - 中：単一機能の追加やデータ管理方法の変更など
  - 小：表記修正・運用ルールの明文化など軽微な変更
- **対象ツール**は「Claude Code／Claude.aiチャット／手動」のいずれかを記載する。
- ファイル冒頭の「目次（一覧・フィルター用）」テーブルにも、追記した内容を1行追加する。詳細ログ本文だけでなく、目次テーブルの更新も忘れないこと。
- 新しいログは詳細ログ・目次テーブルともに末尾に追加する（既存ログの並び順は変更しない）。
- 三ファイルルール・CSV更新と同じく、これも作業完了の必須条件として扱う（忘れてはいけない）
