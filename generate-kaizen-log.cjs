const ExcelJS = require('exceljs');
const path = require('path');

const logs = [
  {
    date: '2026/06',
    title: 'Astro化（HTML/CSS手書きからの移行）',
    size: '大',
    tool: '手動',
    what: 'HTML/CSSを1ファイルずつ手書きしていた状態から、Astro（静的サイトフレームワーク）に移行。',
    why: [
      'レビュー1本ごとにHTML全体を複製・編集する必要があり、ミスが起きやすい',
      '共通パーツ（ヘッダー、カード、評価表示など）を直す際に全ページを手で修正する必要がある',
      'レビュー数が増えるほど作業コストが線形に増えていく',
    ],
    result: [
      'レビューデータをJavaScriptオブジェクト（src/data/reviews/*.js）として管理する形に統一',
      '詳細ページは [id].astro 1ファイルが全レビュー分を動的に生成（動的ルーティング）',
      '共通レイアウトは BaseLayout.astro に集約し、デザイン変更が1箇所で済むように',
      '一覧ページのフィルタリング（ジャンル・難易度などのURLクエリパラメータ）も実装',
      '作業時間短縮：25分→15分',
    ],
  },
  {
    date: '2026/06',
    title: 'GitHub Pages + gh-pagesによるデプロイ体制構築',
    size: '中',
    tool: '手動',
    what: 'GitHub Pagesをホスティング先とし、gh-pages パッケージで npm run deploy 一発でビルド＋公開できる体制を構築。',
    why: [
      'Astro化に伴い、ビルドして静的HTMLを生成する工程が必要になったため',
      '手動でのファイルアップロードを避け、コマンド一つで公開まで完結させたかったため',
    ],
    result: [
      'npm run deploy で astro build → dist/ 生成 → gh-pages ブランチへプッシュ → GitHub Pages自動公開、の流れが確立',
      'ソースコード管理（git push／mainブランチ）とサイト公開（gh-pages ブランチ）が分離され、それぞれ独立して扱えるように',
    ],
  },
  {
    date: '2026/06',
    title: 'Claude Code導入によるレビュー追加作業の自動化',
    size: '大',
    tool: 'Claude Code',
    what: 'レビュー記事の追加・更新作業を、Claude Code（ターミナルから操作するAIコーディングツール）に移行。',
    why: [
      'レビュー追加のたびに3つのデータファイル（詳細ファイル・index.js・reviews.js）を手作業で更新するのが煩雑だった',
      'ファイル間でフィールド構成や画像パスの書き方が微妙に異なり（例：詳細ファイルは相対パス、reviews.jsはフルパス）、ミスが起きやすかった',
      'ChatGPT（記事生成）とClaude（あらすじ作成）を使い分けつつ、最終的なファイル整形は自動化したかった',
    ],
    result: [
      'プロジェクトルートに CLAUDE.md を設置し、データスキーマ・ファイル更新ルール・パスの書き分け・禁止事項などをドキュメント化',
      'Claude Codeが起動時に CLAUDE.md を自動参照し、レビュー追加時に以下を自動実行する体制が完成：',
      '  1. 既存レビューファイルを読んでフォーマットを確認',
      '  2. あらすじを自動生成（150字以内・ネタバレなし）',
      '  3. 詳細ファイル・index.js・reviews.jsの3ファイルを作成・更新',
      '  4. reviews-list.csv（管理用CSV）に1行追加',
      '「映画タイトルと素材を渡すだけ」でレビュー追加が完結する状態に',
      '作業時間短縮：15分→5分',
    ],
  },
  {
    date: '2026/06',
    title: 'レビュー管理表のCSV化',
    size: '中',
    tool: 'Claude Code',
    what: 'Googleスプレッドシートで手動管理していたレビュー一覧表を、プロジェクト内の reviews-list.csv に統合。',
    why: [
      'スプレッドシートはClaude Codeから直接操作できないため、レビュー追加のたびに手動転記が必要だった',
      '同じ情報（タイトル・公開日・各種スコアなど）を二重管理するのは手間が大きかった',
    ],
    result: [
      'reviews-list.csv をプロジェクトルートに設置し、CLAUDE.md に「レビュー追加・更新のたびに必ず更新する」ルールを明記',
      'レビュー追加と同時にCSVへの追記もClaude Codeが自動で行うように',
      '公開状況（公開中／非公開など）の列は手動管理を継続し、自動更新の対象から除外',
      'CSVはGoogleスプレッドシートに「ファイル → インポート」で読み込んで閲覧（文字化け防止のため）',
      '作業時間短縮：10分→3分',
    ],
  },
  {
    date: '2026/06',
    title: 'ソースコードのバックアップ運用整備',
    size: '小',
    tool: 'Claude Code',
    what: 'npm run deploy だけではソースコード（src/配下など）がGitHubにアップロードされないことを整理し、別途バックアップ運用を明文化。',
    why: [
      'npm run deploy はビルド成果物（dist/）のみを gh-pages ブランチに送る仕組みで、ソースコード自体はGitHubに残らないことが判明',
      'PCの故障や誤削除に備え、ソースコードの保存先を確保したかった',
    ],
    result: [
      '「変更をGitHubにバックアップしてください」とClaude Codeに指示するだけで git add → git commit → git push を一括実行できる運用に整理',
      'サイト公開（npm run deploy）とソースコード保存（git push）が独立した作業であることをマニュアル化し、混同を防止',
    ],
  },
  {
    date: '2026-06-19',
    title: '既存レビューのタイムスタンプ修正・整合性チェック',
    size: '小',
    tool: 'Claude Code',
    what: '全28本のレビューを対象に、タイムスタンプのルール違反チェックと整合性チェック（bikkuri/guro/animalの4箇所同期確認）を実施し、違反箇所を修正。',
    why: [
      '.clauderules/timestamps.md のルール（time は10分単位または序盤/中盤/終盤、text はネタバレなし予兆のみ）に違反しているエントリが複数存在していたため',
      '書式が「開始〜序盤」「後半」「全編通して」など非標準のものが混在していたため',
    ],
    result: [
      'ネタバレ表現の修正（2ファイル）：midsommar（「死体が映る」→予兆表現に）、talk-to-me（「子供がかわいそうな目に遭う」→「子供が危険な状況に巻き込まれる緊張感の高い展開」）',
      'time 書式の統一（6ファイル）：「開始〜序盤」/「開始〜中盤」→「序盤」、「後半」→「終盤」、「開始20〜40分前後」→「開始30分前後」、「中盤から」→「中盤以降」',
      '不正エントリの削除（1ファイル）：scary-movie の「全編通して」エントリを削除（時間帯を示さない一般コメントのため）',
      '整合性チェック結果：全28本で bikkuri/guro/animal の数値は4箇所（詳細ファイル/fearCards/reviews.js/CSV）すべて一致。不整合なし。',
      '未解決の課題：reviews-list.csv に日常侵食度カラムが存在しない（consistency-check.md では同期対象とされているが未追加）。要判断。',
    ],
  },
  {
    date: '2026-06-20',
    title: 'サイト改善ログのExcel化',
    size: '小',
    tool: 'Claude Code',
    what: 'サイト改善ログをMarkdown→CSV→Excel(.xlsx)に変換。目次シート＋個別ログシートの構成に変更。',
    why: [
      'Markdownの目次テーブルと詳細ログの二重管理が冗長だった',
      'スプレッドシートで閲覧しやすい形式にしたかった',
    ],
    result: [
      'サイト改善ログ.md / .csv を廃止し、サイト改善ログ.xlsx に統合',
      '目次シート（概要・変更の大きさ・日付）＋個別ログシート（レポート形式）の構成に変更',
      'CLAUDE.md の参照先も更新',
    ],
  },
  {
    date: '2026-06-22',
    title: '詳細ページに関連作品セクションを追加',
    size: '中',
    tool: 'Claude Code',
    what: 'レビュー詳細ページ（[id].astro）に「似たジャンルの作品」セクションを追加。ジャンル一致数＋監督ボーナスでスコアリングし、関連度の高い上位4件をカード表示。',
    why: [
      'レビュー詳細ページから他の作品への導線がなく、一覧ページに戻らないと次の作品を探せなかった',
      'ジャンルの近い作品を自動提案することで、サイト内の回遊性を高めたかった',
    ],
    result: [
      'reviews.js（フラット配列）をデータソースとして、ジャンル一致数（＋監督一致で+0.5）のスコアで関連度を算出',
      'スコア降順→難易度の近さ→公開年降順の優先順位でソートし、上位4件を表示',
      '既存の .cards-grid / .review-card 構造をそのまま流用し、CSSの追加なしで実装',
      'スコア0の作品は除外され、関連作品がない場合はセクション自体が非表示になる',
    ],
  },
  {
    date: '2026-06-23',
    title: 'まとめ記事テンプレート（articles/[id].astro）新規作成',
    size: '中',
    tool: 'Claude Code',
    what: 'src/pages/articles/[id].astro を新規作成。複数作品を横断比較するまとめ記事の動的ルーティングテンプレートを実装。',
    why: [
      '個別レビューページだけでは複数作品の比較ができず、ユーザーが作品選びの判断をしづらかった',
      'まとめ記事として複数作品の怖さ指標を一画面で比較できるページが必要だった',
    ],
    result: [
      'articles データから動的にページを生成する [id].astro テンプレートを作成',
      '各作品ブロック（怖さ指標＋詳細レビューへのリンク）、比較まとめ表、おすすめ順の提案、モトジロウ総評の構成',
      '既存のCSS・コンポーネントクラス（seo-summary, work-info-table, timestamp-item, motojiro-casual 等）をそのまま流用し、CSSの追加なしで実装',
    ],
  },
  {
    date: '2026-06-23',
    title: 'アリ・アスターまとめ記事データ（articles.js）新規作成',
    size: '小',
    tool: 'Claude Code',
    what: 'src/data/articles.js を新規作成。まとめ記事テンプレート（articles/[id].astro）のデータソースとなる記事データファイルを作成。',
    why: [
      '前ステップで作成した articles/[id].astro テンプレートにデータを供給するファイルが必要だった',
      '第1弾としてアリ・アスター監督3作品（ヘレディタリー・ミッドサマー・ボーはおそれている）の比較記事を用意',
    ],
    result: [
      'articles 配列に記事データ1件（ari-aster-review）を定義',
      'filmIds / filmComments / recommendations / モトジロウ総評など、テンプレートが参照する全フィールドを網羅',
      'テンプレートとデータが揃い、まとめ記事ページがビルド可能な状態に',
    ],
  },
  {
    date: '2026-06-23',
    title: 'まとめ記事一覧ページ作成・詳細ページの導線整備',
    size: '中',
    tool: 'Claude Code',
    what: 'src/pages/articles/index.astro を新規作成し、まとめ記事の一覧ページを実装。詳細ページのパンくず・戻るボタンも一覧ページへの導線に変更。',
    why: [
      'まとめ記事の詳細ページはあるが一覧ページがなく、記事が増えた際に探しづらかった',
      '詳細ページからトップにしか戻れず、まとめ記事間の回遊ができなかった',
    ],
    result: [
      'articles/index.astro を新規作成。各記事を作品画像横並び＋タイトル＋抜粋テキストのカード形式で一覧表示',
      '既存の page-hero / cards-grid / review-card 構造を流用し、CSSの追加なしで実装',
      '詳細ページのパンくず「まとめ記事」をリンク化し、戻るボタンも「← まとめ記事一覧へ戻る」に変更',
    ],
  },
  {
    date: '2026-06-23',
    title: 'まとめ記事へのサイト全体導線を整備',
    size: '小',
    tool: 'Claude Code',
    what: 'ヘッダーナビ（PC・ドロワー）に「まとめ記事」リンクを追加。トップページに「まとめ記事を読む →」ボタンを追加。一覧カードのPC表示サイズも調整。',
    why: [
      'まとめ記事ページへの導線がなく、URLを直接入力しないとアクセスできなかった',
      '一覧カードがPC表示で横幅いっぱいに広がり、レビュー一覧と見た目の統一感がなかった',
    ],
    result: [
      'BaseLayout.astro のpc-nav・drawerに「まとめ記事」リンクを追加し、全ページから遷移可能に',
      'トップページに「全作品を見る」の下に「まとめ記事を読む →」ボタンを追加',
      '一覧カードからwidth:100%を除去し、レビュー一覧と同じレスポンシブ幅（PC時2列→3列）に統一',
    ],
  },
  {
    date: '2026/06/24',
    title: 'タイムスタンプ未取得レビューに準備中メッセージを表示',
    size: '小',
    tool: 'Claude Code',
    what: 'タイムスタンプが空配列のレビュー詳細ページで、「この作品のタイムスタンプは準備中です」というメッセージを表示するようにした。',
    why: [
      'タイムスタンプ未取得の作品で攻略ガイドセクションの中身が空のまま表示されていた',
      'ユーザーに「情報がない」のか「表示バグ」なのか区別がつかない状態だった',
    ],
    result: [
      '[id].astro でtimestamps配列の長さを判定し、空の場合は準備中メッセージを表示',
      '破線ボーダーのスタイル（.timestamp-empty）を追加し、準備中であることが視覚的にわかるようにした',
    ],
  },
];

async function main() {
  const workbook = new ExcelJS.Workbook();

  // ========== 共通スタイル定義 ==========
  const COLORS = {
    headerBg: 'FF2D3748',
    headerFont: 'FFFFFFFF',
    sizeLarge: 'FFFC8181',
    sizeMedium: 'FFFBD38D',
    sizeSmall: 'FF9AE6B4',
    sectionBg: 'FFEDF2F7',
    sectionFont: 'FF2D3748',
    border: 'FFE2E8F0',
    lightBg: 'FFF7FAFC',
  };

  // ========== 目次シート ==========
  const tocSheet = workbook.addWorksheet('目次');
  tocSheet.properties.defaultRowHeight = 22;

  tocSheet.columns = [
    { header: '日付', key: 'date', width: 16 },
    { header: '概要', key: 'title', width: 52 },
    { header: '変更の大きさ', key: 'size', width: 16 },
  ];

  // ヘッダー行スタイル
  const headerRow = tocSheet.getRow(1);
  headerRow.height = 28;
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: COLORS.headerFont }, size: 11 };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.headerBg } };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = {
      bottom: { style: 'thin', color: { argb: COLORS.border } },
    };
  });

  const sheetNames = logs.map((log, index) => {
    const safeName = log.title.replace(/[*?:\\/\[\]]/g, '');
    return `${index + 1}. ${safeName}`.substring(0, 31);
  });

  logs.forEach((log, i) => {
    const row = tocSheet.addRow({ date: log.date, title: log.title, size: log.size });
    row.height = 24;

    row.eachCell((cell, colNumber) => {
      cell.alignment = { vertical: 'middle' };
      cell.border = {
        bottom: { style: 'hair', color: { argb: COLORS.border } },
      };
      if (i % 2 === 1) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.lightBg } };
      }
    });

    // 概要セルに個別ログシートへのハイパーリンク
    const titleCell = row.getCell(2);
    titleCell.value = {
      text: log.title,
      hyperlink: `#'${sheetNames[i]}'!A1`,
    };
    titleCell.font = { size: 11, color: { argb: 'FF2B6CB0' }, underline: true };

    // 変更の大きさに色付け
    const sizeCell = row.getCell(3);
    sizeCell.alignment = { vertical: 'middle', horizontal: 'center' };
    const sizeColor = log.size === '大' ? COLORS.sizeLarge : log.size === '中' ? COLORS.sizeMedium : COLORS.sizeSmall;
    sizeCell.font = { bold: true, size: 11 };
    sizeCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: sizeColor } };
  });

  tocSheet.autoFilter = { from: 'A1', to: 'C1' };

  // ========== 個別ログシート ==========
  logs.forEach((log, index) => {
    const safeName = log.title.replace(/[*?:\\/\[\]]/g, '');
    const sheetName = `${index + 1}. ${safeName}`.substring(0, 31);
    const sheet = workbook.addWorksheet(sheetName);
    sheet.properties.defaultRowHeight = 20;

    sheet.getColumn(1).width = 4;
    sheet.getColumn(2).width = 80;

    let rowNum = 1;

    // --- タイトル ---
    const titleRow = sheet.getRow(rowNum);
    sheet.mergeCells(rowNum, 1, rowNum, 2);
    const titleCell = titleRow.getCell(1);
    titleCell.value = log.title;
    titleCell.font = { bold: true, size: 16, color: { argb: COLORS.headerBg } };
    titleCell.alignment = { vertical: 'middle' };
    titleRow.height = 36;
    rowNum += 1;

    // --- メタ情報（日付・大きさ・ツール） ---
    const metaRow = sheet.getRow(rowNum);
    sheet.mergeCells(rowNum, 1, rowNum, 2);
    const metaCell = metaRow.getCell(1);
    metaCell.value = `${log.date}　｜　変更の大きさ：${log.size}　｜　対象ツール：${log.tool}`;
    metaCell.font = { size: 10, color: { argb: 'FF718096' } };
    metaCell.alignment = { vertical: 'middle' };
    metaCell.border = { bottom: { style: 'medium', color: { argb: COLORS.headerBg } } };
    metaRow.height = 26;
    rowNum += 2;

    // --- セクション描画ヘルパー ---
    function addSection(label, content) {
      const sectionRow = sheet.getRow(rowNum);
      sheet.mergeCells(rowNum, 1, rowNum, 2);
      const sectionCell = sectionRow.getCell(1);
      sectionCell.value = label;
      sectionCell.font = { bold: true, size: 12, color: { argb: COLORS.sectionFont } };
      sectionCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.sectionBg } };
      sectionCell.alignment = { vertical: 'middle', indent: 1 };
      sectionCell.border = {
        left: { style: 'medium', color: { argb: COLORS.headerBg } },
      };
      sectionRow.height = 28;
      rowNum += 1;

      if (typeof content === 'string') {
        const r = sheet.getRow(rowNum);
        const c = r.getCell(2);
        c.value = content;
        c.font = { size: 11 };
        c.alignment = { wrapText: true, vertical: 'top' };
        r.height = Math.max(24, Math.ceil(content.length / 40) * 18);
        rowNum += 1;
      } else if (Array.isArray(content)) {
        content.forEach((item) => {
          const r = sheet.getRow(rowNum);
          const bulletCell = r.getCell(1);
          bulletCell.value = '•';
          bulletCell.font = { size: 11, color: { argb: COLORS.headerBg } };
          bulletCell.alignment = { horizontal: 'center', vertical: 'top' };

          const textCell = r.getCell(2);
          textCell.value = item;
          textCell.font = { size: 11 };
          textCell.alignment = { wrapText: true, vertical: 'top' };
          r.height = Math.max(22, Math.ceil(item.length / 40) * 18);
          rowNum += 1;
        });
      }
      rowNum += 1;
    }

    addSection('何をしたか', log.what);
    addSection('なぜ行ったか', log.why);
    addSection('どうなったか', log.result);

    // --- 目次に戻るリンク ---
    rowNum += 1;
    const backRow = sheet.getRow(rowNum);
    sheet.mergeCells(rowNum, 1, rowNum, 2);
    const backCell = backRow.getCell(1);
    backCell.value = { text: '← 目次に戻る', hyperlink: "#'目次'!A1" };
    backCell.font = { size: 11, color: { argb: 'FF2B6CB0' }, underline: true };
    backCell.alignment = { vertical: 'middle' };
    backRow.height = 28;
  });

  const outputPath = path.join(__dirname, 'サイト改善ログ.xlsx');
  await workbook.xlsx.writeFile(outputPath);
  console.log('Created:', outputPath);
}

main().catch(console.error);
