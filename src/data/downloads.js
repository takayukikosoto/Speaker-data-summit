// ダウンロードリンクのデータ
// CSVファイルの代わりにJavaScriptオブジェクトとして管理
// 実際の環境では、このデータをCSVやJSONファイルから読み込むことも可能

export const downloadItems = [
  {
    id: 'sponsor_guide',
    category: 'sponsor',
    title: 'スポンサーガイド',
    description: 'スポンサー出展に関する詳細情報と注意事項が記載されています。料金プラン、特典内容、申込方法などをご確認いただけます。',
    fileType: 'PDF',
    fileSize: '2.4MB',
    downloadUrl: 'https://drive.google.com/file/d/xxxx/view',
    lastUpdated: '2025-04-15'
  },
  {
    id: 'booth_manual',
    category: 'sponsor',
    title: 'ブース設営マニュアル',
    description: '展示ブースの設営・撤去に関するガイドラインです。搬入出スケジュール、電源・ネットワーク情報、禁止事項などが記載されています。',
    fileType: 'PDF',
    fileSize: '3.1MB',
    downloadUrl: 'https://drive.google.com/file/d/yyyy/view',
    lastUpdated: '2025-05-10'
  },
  {
    id: 'logo_package',
    category: 'branding',
    title: 'ロゴパッケージ',
    description: '高解像度ロゴとブランドガイドラインが含まれています。プロモーション資料作成時にご利用ください。',
    fileType: 'ZIP',
    fileSize: '15.2MB',
    downloadUrl: 'https://drive.google.com/file/d/zzzz/view',
    lastUpdated: '2025-04-20'
  },
  {
    id: 'presentation_template',
    category: 'speaker',
    title: 'プレゼンテーションテンプレート',
    description: '登壇者用のPowerPointテンプレートです。このテンプレートを使用して発表資料を作成してください。',
    fileType: 'PPTX',
    fileSize: '1.8MB',
    downloadUrl: 'https://drive.google.com/file/d/aaaa/view',
    lastUpdated: '2025-05-05'
  },
  {
    id: 'session_guidelines',
    category: 'speaker',
    title: 'セッションガイドライン',
    description: '講演時間、Q&A対応、資料提出期限など、登壇者が知っておくべき重要事項をまとめています。',
    fileType: 'PDF',
    fileSize: '1.2MB',
    downloadUrl: 'https://drive.google.com/file/d/bbbb/view',
    lastUpdated: '2025-05-12'
  },
  {
    id: 'event_floorplan',
    category: 'general',
    title: '会場フロアマップ',
    description: '高輪ゲートウェイコンベンションセンター 4階の詳細なフロアマップです。ブース配置、セッション会場、休憩エリアなどをご確認いただけます。',
    fileType: 'PDF',
    fileSize: '4.5MB',
    downloadUrl: 'https://drive.google.com/file/d/cccc/view',
    lastUpdated: '2025-05-20'
  },
  {
    id: 'press_kit',
    category: 'press',
    title: 'プレスキット',
    description: 'メディア関係者向けの資料パッケージです。イベント概要、出展企業リスト、注目セッション情報などが含まれています。',
    fileType: 'ZIP',
    fileSize: '8.7MB',
    downloadUrl: 'https://drive.google.com/file/d/dddd/view',
    lastUpdated: '2025-05-15'
  },
  {
    id: 'wifi_access',
    category: 'general',
    title: 'Wi-Fi接続ガイド',
    description: '会場内のWi-Fi接続方法と注意事項です。セッション発表者、ブース出展者向けの専用ネットワーク情報も含まれています。',
    fileType: 'PDF',
    fileSize: '0.8MB',
    downloadUrl: 'https://drive.google.com/file/d/eeee/view',
    lastUpdated: '2025-05-22'
  }
];

// カテゴリー情報
export const categories = {
  sponsor: {
    name: 'スポンサー向け資料',
    description: 'スポンサー企業様向けの各種ガイドラインやマニュアルです。'
  },
  speaker: {
    name: '登壇者向け資料',
    description: 'セッション発表者向けのテンプレートやガイドラインです。'
  },
  branding: {
    name: 'ブランド資料',
    description: 'ロゴや広報資料など、プロモーションにご利用いただける素材です。'
  },
  press: {
    name: 'プレス向け資料',
    description: 'メディア関係者向けの資料パッケージです。'
  },
  general: {
    name: '一般資料',
    description: '会場案内や各種一般情報です。'
  }
};
