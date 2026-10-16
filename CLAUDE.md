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
  content.config.js     ← レビュー・まとめ記事のスキーマ（ルールに合わないとビルドが止まる）
  content/
    reviews/
      hereditary.yaml   ← 個別レビューデータ
      midsommar.yaml
      ... （1映画 = 1ファイル。ファイル名がそのまま id / URL になる）
    articles/
      ari-aster-review.md ← まとめ記事（1記事 = 1ファイル。ファイル名がそのまま id / URL になる）
  utils/
    reviews.js          ← getReviews()：全レビューを sortOrder 順で読み込む共通関数
    articles.js         ← getArticles()：まとめ記事を読み込み、本文の構成チェックとHTML変換をする共通関数
  pages/
    reviews/
      [id].astro        ← 詳細ページ（動的ルーティング）
      index.astro       ← レビュー一覧ページ
    articles/
      [id].astro        ← まとめ記事詳細ページ
      index.astro       ← まとめ記事一覧ページ
    diagnosis/
      index.astro       ← ホラー映画診断ページ
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
  article-schema.md            ← まとめ記事の追加手順・Markdownの書き方
```

レビュー・まとめ記事の詳細ルールは `.clauderules/` 配下に分割している。該当ファイル（`src/content/reviews/*.yaml`・`src/content/articles/*.md` など）を読み書きするタイミングで自動的に読み込まれる。

---

## ソート順のルール

- 一覧ページ（`reviews/index.astro`）は `publishedAt` の降順（新しい順）に並べて表示する
- ソートキーが `publishedAt` なのは、編集時の `updatedAt` 変更で順番が変わらないようにするため
- 公開日が同じ作品どうしは `sortOrder` の小さいほうが一覧の上に来る。入れ替えたいときは2作品の `sortOrder` を交換する
- 新しい映画の `sortOrder` は、既存の最大値＋1 にする（重複するとビルドが止まる）
- まとめ記事は、トップページ・まとめ記事一覧とも `publishedAt` の降順（新しい順）に並ぶ

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

```

データはJSオブジェクト形式で渡されることが多い。Claude Code が YAML に変換して `src/content/reviews/[id].yaml` を1ファイル作成する（`id` はファイル名にするので YAML には書かない。`sortOrder` を足す）。あわせて `reviews-list.csv` に1行追加する。

詳細なフィールド仕様・コード例は `.clauderules/review-schema.md` を参照。

### 既存レビューの修正

```
src/content/reviews/xxx.yaml の [フィールド名] を [新しい値] に修正してください。
updatedAt も今日の日付（YYYY-MM-DD）に更新してください。
※ reviews-list.csv 側も該当列があれば同様に更新してください。
```

### まとめ記事の追加・修正

`src/content/articles/[id].md` を1ファイル作成・編集する。本文は「イントロ → `## 作品ID`（紹介する作品の数だけ）→ `## 総評`」の順で書く。書き方の詳細は `.clauderules/article-schema.md` を参照。まとめ記事は `reviews-list.csv` の対象外。

---

## デプロイ

```bash
npm run deploy
```

GitHub Pages に自動デプロイされる。ビルド成果物は `dist/` に出力され、`gh-pages` ブランチにプッシュされる。

**公開前確認ルール：** レビュー追加・修正作業（YAML 1ファイル＋`reviews-list.csv`）が完了した時点で作業を止める。`npm run deploy` は人間からの明示的な指示があるまで実行しない。

---

## 改善ログ自動更新ルール

- サイトに修正・変更を加えた場合（レビュー記事の追加を除く）、`サイト改善ログ.xlsx` への追記も指示なしで自動的に行う。
- **レビュー記事の新規追加は改善ログの対象外。** レビュー追加時は YAML 1ファイル＋`reviews-list.csv`の更新のみ。
- ファイル形式：Excel(.xlsx)。`generate-kaizen-log.cjs` を `node generate-kaizen-log.cjs` で実行して生成する。
- 構成：
  - **目次シート：** 日付・概要・変更の大きさの一覧
  - **個別ログシート：** 各変更ごとに1シート。レポート形式（何をしたか／なぜ行ったか／どうなったか）
- **変更の大きさ**は「大／中／小」の3段階で判定する。
  - 大：サイト構造・運用フロー自体が変わる規模の変更
  - 中：単一機能の追加やデータ管理方法の変更など
  - 小：表記修正・運用ルールの明文化など軽微な変更
- **対象ツール**は「Claude Code／Claude.aiチャット／手動」のいずれかを記載する。
- 新しいログは `generate-kaizen-log.cjs` の `logs` 配列の末尾にオブジェクトを追加し、再実行して `.xlsx` を再生成する。
- これも作業完了の必須条件として扱う（忘れてはいけない）
