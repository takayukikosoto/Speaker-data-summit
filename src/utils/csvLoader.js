/**
 * CSVファイルを読み込んでJavaScriptオブジェクトに変換するユーティリティ
 */

/**
 * CSVファイルを読み込み、オブジェクトの配列に変換する
 * @param {string} filePath - CSVファイルへのパス
 * @returns {Promise<Array>} - CSVデータのオブジェクト配列
 */
export const loadCSV = async (filePath) => {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Failed to load CSV: ${response.status} ${response.statusText}`);
    }
    
    const text = await response.text();
    return parseCSV(text);
  } catch (error) {
    console.error('Error loading CSV file:', error);
    return [];
  }
};

/**
 * CSVテキストをパースしてオブジェクトの配列に変換する
 * @param {string} csvText - CSVテキスト
 * @returns {Array} - CSVデータのオブジェクト配列
 */
const parseCSV = (csvText) => {
  // 行に分割
  const lines = csvText.split('\n');
  if (lines.length < 2) return [];
  
  // ヘッダー行を取得
  const headers = lines[0].split(',');
  
  // データ行をオブジェクトに変換
  return lines.slice(1).filter(line => line.trim() !== '').map(line => {
    const values = parseCSVLine(line);
    const item = {};
    
    headers.forEach((header, index) => {
      item[header] = values[index] || '';
    });
    
    return item;
  });
};

/**
 * CSVの1行をパースして配列に変換する（カンマ内のカンマもサポート）
 * @param {string} line - CSVの1行
 * @returns {Array} - 値の配列
 */
const parseCSVLine = (line) => {
  const values = [];
  let currentValue = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(currentValue);
      currentValue = '';
    } else {
      currentValue += char;
    }
  }
  
  // 最後の値を追加
  values.push(currentValue);
  
  return values;
};

/**
 * カテゴリー情報を生成する
 * @param {Array} items - ダウンロードアイテムの配列
 * @returns {Object} - カテゴリー情報
 */
export const generateCategories = (items) => {
  const categories = {};
  
  // カテゴリーの日本語名マッピング
  const categoryNames = {
    sponsor: 'スポンサー向け資料',
    speaker: '登壇者向け資料',
    branding: 'ブランド資料',
    press: 'プレス向け資料',
    general: '一般資料'
  };
  
  // カテゴリーの説明マッピング
  const categoryDescriptions = {
    sponsor: 'スポンサー企業様向けの各種ガイドラインやマニュアルです。',
    speaker: 'セッション発表者向けのテンプレートやガイドラインです。',
    branding: 'ロゴや広報資料など、プロモーションにご利用いただける素材です。',
    press: 'メディア関係者向けの資料パッケージです。',
    general: '会場案内や各種一般情報です。'
  };
  
  // アイテムからカテゴリーを抽出
  items.forEach(item => {
    if (!categories[item.category]) {
      categories[item.category] = {
        name: categoryNames[item.category] || item.category,
        description: categoryDescriptions[item.category] || ''
      };
    }
  });
  
  return categories;
};
