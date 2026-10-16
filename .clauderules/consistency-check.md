# 整合性チェックルール

適用タイミング：新規レビュー追加時・既存レビュー修正時（どちらも必須）

---

## STEP 1｜スキーマチェック（自動）

`npm run build` を実行する。`src/content.config.js` のスキーマが、以下をすべて自動でチェックする。エラーが出たら、表示されたファイル・項目を直して再実行する。直し方が判断できない内容（スコアの値そのものなど）は人間に報告して止まる。

必須項目の欠落：
- `title` / `titleEn` / `year`
- `genres`（1件以上）/ `difficulty` / `animal`
- `animalLabel` / `animalDesc`
- `bikkuri` / `guro`
- `image` / `motojiroImg` / `motojiroAlt`
- `publishedAt` / `updatedAt` / `sortOrder`
- `synopsis` / `meta`（runtime・genre・country・director・cast）/ `verdict`
- `fearCards`（4件）/ `timestamps`
- `motojiroComment` / `fitOk` / `fitNg`
- 想定外の項目名（書き間違い）もエラーになる

値の形式：
- `difficulty` が `beginner` / `mid` / `advanced` 以外
- `animal` が `safe` / `warn` / `danger` 以外
- `animalLabel` が `animal` 値と不一致（safe → `✅ 安全`、warn → `⚠️ 注意`、danger → `❌ 危険`）
- `bikkuri` / `guro` / `fearCards[*].score` が 1〜5 の整数以外
- `bikkuri` / `guro` が fearCards のびっくり度・グロ度のスコアと不一致
- `fearCards` が4件でない、または順番・アイコン・タイトルが規定と違う
- `timestamps` の各項目が3モード（.clauderules/timestamps.md）のどれの形にも合わない
- `type: none` がほかの項目と混ざっている
- `publishedAt` / `updatedAt` が `YYYY-MM-DD` 形式以外、または updatedAt が publishedAt より前
- `image` が `/assets/images/[英数字とハイフン].webp` 形式以外
- `motojiroImg` が5種類以外
- `synopsis` が150字を超えている
- `sortOrder` がほかの作品と重複している

**スキーマで許可しているもの（エラーにならない）：**
- `timestamps: []`（詳細ページで「準備中」表示。未取得の作品のみ）

---

## STEP 2｜スキーマでは見られない項目（Claude Code が確認）

- `image` のファイルが `public/assets/images/` に実在するか（ない場合は人間にサムネイル追加を依頼する）
- `reviews-list.csv` の該当行が YAML の内容と一致しているか

---

## STEP 3｜人間レビュー必須項目（自動化しない）

Claude Code はここまでで止まり、以下を人間に確認を促すメッセージを出す。

```
以下の項目は人間による確認が必要です（consistency-check-manual.md を参照）：
- [ ] スコアと本文の整合性
- [ ] 動物安否の判定
- [ ] 他レビューとの相対スコアバランス
```

---

## 完了条件

STEP 1〜2 が通過したあと、以下を必ず更新する：

- `reviews-list.csv`（公開状況の列は手動のため空欄のまま）
- 改善ログは CLAUDE.md の「改善ログ自動更新ルール」に従う（レビューの新規追加は対象外）
