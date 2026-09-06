# 整合性チェックルール

適用タイミング：新規レビュー追加時・既存レビュー修正時（どちらも必須）

---

## STEP 1｜ファイル間の数値同期チェック（自動修正可）

対象ファイル：`[id].js` → `index.js` → `reviews.js`

| チェック項目 | [id].js の参照先 | reviews.js の対応フィールド |
|---|---|---|
| bikkuri | `bikkuri` | `bikkuri` |
| guro | `guro` | `guro` |
| difficulty | `difficulty` | `difficulty` |
| animal | `animal` | `animal` |
| genres | `genres` | `genres` |
| publishedAt | `publishedAt` | `publishedAt` |
| updatedAt | `updatedAt` | `updatedAt` |
| image パス | `/assets/images/[id].webp` | `/bibiri-movie-club/assets/images/[id].webp` |

**自動修正ルール**
- 数値の不一致（bikkuri・guro）→ `[id].js` を正として `reviews.js` を上書き
- image パスのプレフィックス差異（`/bibiri-movie-club/` の有無）は仕様。修正しない

---

## STEP 2｜フィールド存在チェック（自動検出・人間判断）

`[id].js` に以下がすべて存在するか確認する。欠落があれば人間に報告して止まる。

必須フィールド一覧：
- `id` / `title` / `titleEn` / `year`
- `genres`（配列）/ `difficulty` / `animal`
- `animalLabel` / `animalDesc`
- `bikkuri` / `guro`
- `image` / `motojiroImg` / `motojiroAlt`
- `publishedAt` / `updatedAt`
- `synopsis` / `meta` / `verdict`
- `fearCards`（4件）/ `timestamps`（1件以上）
- `motojiroComment` / `fitOk` / `fitNg`

---

## STEP 3｜値の形式チェック（自動検出・人間判断）

以下の形式違反を検出したら人間に報告して止まる。

- `difficulty` が `beginner` / `mid` / `advanced` 以外
- `animal` が `safe` / `warn` / `danger` 以外
- `animalLabel` が `animal` 値と不一致
  - safe → `✅ 安全`
  - warn → `⚠️ 注意`
  - danger → `❌ 危険`
- `bikkuri` / `guro` が 1〜5 の整数以外
- `fearCards` の件数が 4 件以外
- `fearCards[*].score` が 1〜5 の整数以外
- `timestamps[*].level` が `high` / `mid` / `low` 以外
- `publishedAt` / `updatedAt` が `YYYY-MM-DD` 形式以外
- `image` が `/assets/images/[id].webp` 形式以外

---

## STEP 4｜人間レビュー必須項目（自動化しない）

Claude Code はここまでで止まり、以下を人間に確認を促すメッセージを出す。

```
以下の項目は人間による確認が必要です（consistency-check-manual.md を参照）：
- [ ] スコアと本文の整合性
- [ ] 動物安否の判定
- [ ] 他レビューとの相対スコアバランス
```

---

## 完了条件

STEP 1〜3 が通過したあと、以下を必ず更新する：

- `reviews-list.csv`（public 列は手動のため空欄のまま）
- `サイト改善ログ.md`（magnitude: 小、target: Claude Code）
