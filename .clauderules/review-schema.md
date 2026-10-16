---
paths:
  - "src/content/reviews/**/*.yaml"
---

# レビュー追加・データ仕様ルール

新しい映画レビューを追加するときは、`src/content/reviews/[film-id].yaml` を1ファイル作成する。ファイルを置くだけで一覧・詳細・診断・関連作品のすべてに反映される（目次ファイルへの追記は不要）。

データのルールは `src/content.config.js` のスキーマで定義している。ルールに合わないデータがあると `npm run build` / `npm run deploy` がエラーで止まり、どのファイルのどの項目が問題かが表示される。

## `src/content/reviews/[film-id].yaml`

```yaml
title: 日本語タイトル
titleEn: English Title
year: 2024
genres:
  - ジャンル1
  - ジャンル2
difficulty: mid                    # beginner / mid / advanced
animal: safe                       # safe / warn / danger
animalLabel: ✅ 安全               # ✅ 安全 / ⚠️ 注意 / ❌ 危険（animal と一致させる）
animalDesc: 動物に関する説明文
bikkuri: 3                         # 1〜5（fearCards のびっくり度と一致させる）
guro: 2                            # 1〜5（fearCards のグロ度と一致させる）
image: /assets/images/film-id.webp # /bibiri-movie-club/ は不要
motojiroImg: /assets/images/motojiro-excited.png
motojiroAlt: モトジロウの説明
publishedAt: 'YYYY-MM-DD'          # 日付は必ず '' で囲む
updatedAt: 'YYYY-MM-DD'
sortOrder: 44                      # 既存の最大値＋1
synopsis: あらすじ
meta:
  runtime: 110
  genre: ジャンル表示文字列
  country: 制作国
  director: 監督名
  cast: 主演俳優名
verdict: 一言結論
fearCards:
  - icon: 😱
    title: びっくり度
    score: 3
    body: 説明文
  - icon: 🩸
    title: グロ度
    score: 2
    body: 説明文
  - icon: 🧠
    title: 精神ダメージ
    score: 4
    body: 説明文
  - icon: 🌃
    title: 日常侵食度
    score: 3
    body: 説明文
timestamps:
  - time: 開始30分前後
    text: 説明
    level: high                    # high / mid / low
motojiroComment: 本文（<strong>タグ可）
fitOk:
  - おすすめできる人の条件
fitNg:
  - 注意が必要な人の条件
```

**YAML の書き方の注意：**
- `id` は書かない。ファイル名（拡張子を除く）がそのまま id・URL になる。
- 日付は `'2026-10-16'` のように必ず `'` で囲む（囲まないと日付型として読まれ、スキーマエラーになる）。
- 値が `#` `: ` `[` `{` `'` で始まる、または途中に `: ` や ` #` を含む場合は、値全体を `'` で囲む（中の `'` は `''` と2つ重ねる）。
- 字下げは半角スペース2つ。タブは使わない。
- JSオブジェクト形式でデータを受け取った場合は、変換してからこの形式で保存する。JS側の `//` コメントは `#` コメントにして残す。

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
| `sortOrder` | number | 1以上の整数。重複不可（新作は最大値＋1） |

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
