---
paths:
  - "src/pages/reviews/[id].astro"
---

# 詳細ページ（[id].astro）ルール

## 禁止事項

- class名の変更・追加
- CSS の追加
- 既存 section の id・class の変更
- 不要な div の追加
- `section-spoiler` ブロックの追加（永久に除外）
- `motojiro-block`（verdict セクション）の追加（除外済み）

## セクション構成（この順番を維持）

1. `#section-fear` — 恐怖の性質
2. `#section-animal` — 動物の安否
3. `#section-guide` — 防衛タイムスタンプ
4. `#section-fit` — 向いてる人/向いてない人
5. `#section-info` — 作品情報
