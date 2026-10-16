---
paths:
  - "src/content/articles/**/*.md"
---

# まとめ記事の追加・データ仕様ルール

まとめ記事は `src/content/articles/[article-id].md` を1ファイル作成する。ファイル名（拡張子を除く）がそのまま id・URL（`/articles/[article-id]/`）になる。ファイルを置くだけでトップページ・まとめ記事一覧・記事ページに反映される。

ファイルの先頭（`---` で挟んだ部分）に項目を YAML で書き、その下に本文を Markdown で書く。

## ひな形

```markdown
---
title: 記事タイトル
publishedAt: 'YYYY-MM-DD'
updatedAt: 'YYYY-MM-DD'
motojiroImg: /assets/images/motojiro-excited.png
motojiroAlt: モトジロウの説明
recommendations:
  - label: ホラー慣れしてない人
    filmId: 作品ID
    reason: おすすめする理由
---

イントロの文章。改行するとそのまま改行として表示される。

空行をはさむと次の段落になる。

## 作品ID

この作品の紹介文。

## 作品ID

この作品の紹介文。

## 総評

モトジロウの総評。
```

## 本文の構成ルール

本文は必ずこの順番で書く。順番や見出しが違うとビルドがエラーで止まる（チェックは `src/utils/articles.js`）。

1. **イントロ**：最初の `##` より前の文章。一覧ページの抜粋と、検索結果の説明文（meta description）にも使われる。
2. **`## 作品ID`**：紹介する作品ごとに1つ。見出しには `src/content/reviews/` のファイル名（例：`hereditary`）をそのまま書く。作品名・サムネイル・スコア・比較表・目次は、レビューデータから自動で作られる。見出しの順番が記事内の紹介順になる。
3. **`## 総評`**：必ず最後に置く。モトジロウの吹き出しに表示される。

## 書き方の注意

- 改行はそのまま改行（`<br>`）になる。段落を分けたいときは空行を入れる。
- 太字は `**太字**`。総評の太字は、レビューと同じくティール色で表示される。
- `##` 以外の見出し（`#`・`###`）は使わない。記事の見出しはテンプレート側で作るため。
- `recommendations` の `filmId` は、記事内で `## 作品ID` として紹介している作品にする。
- 日付は `'2026-10-16'` のように必ず `'` で囲む。
- `motojiroImg` の選択肢はレビューと同じ5種類（`.clauderules/review-schema.md` を参照）。

## エラーになるもの

スキーマ（`src/content.config.js`）とビルド時のチェックで、以下はエラーで止まる。
- 必須項目（title・publishedAt・updatedAt・motojiroImg・motojiroAlt・recommendations）の欠落、想定外の項目名
- 日付が `YYYY-MM-DD` 形式でない、updatedAt が publishedAt より前
- イントロがない、最後の見出しが `## 総評` でない、`## 作品ID` が1つもない
- 存在しない作品IDの見出し、同じ作品の見出しが2回、見出しの下に文章がない
- `recommendations` の `filmId` が記事内の作品に入っていない
