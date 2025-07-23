/**
 * CSVファイルを保存するためのユーティリティ
 * 注意: これは実際のプロダクション環境では使用しないでください。
 * 本来はサーバーサイドで処理すべきですが、デモ用に簡易的に実装しています。
 */

/**
 * オブジェクトの配列をCSV形式の文字列に変換する
 * @param {Array} items - 変換するオブジェクトの配列
 * @returns {string} - CSV形式の文字列
 */
const convertToCSV = (items) => {
  if (!items || items.length === 0) return '';
  
  // ヘッダー行を取得
  const headers = Object.keys(items[0]);
  
  // ヘッダー行を作成
  const headerRow = headers.join(',');
  
  // データ行を作成
  const rows = items.map(item => {
    return headers.map(header => {
      // カンマやダブルクォートを含む場合は、ダブルクォートで囲む
      const value = item[header] ? item[header].toString() : '';
      if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(',');
  });
  
  // ヘッダーとデータ行を結合
  return [headerRow, ...rows].join('\n');
};

/**
 * CSVデータをファイルとして保存する（ダウンロード）
 * @param {string} csvContent - CSV形式の文字列
 * @param {string} fileName - 保存するファイル名
 */
const downloadCSV = (csvContent, fileName) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * CSVデータをサーバーに送信する（模擬実装）
 * @param {Array} items - 保存するオブジェクトの配列
 * @param {string} endpoint - 保存先のエンドポイント
 * @returns {Promise} - 保存処理の結果
 */
export const saveCSVToServer = async (items, endpoint) => {
  try {
    // 実際のサーバーへのAPIリクエストの代わりに、
    // ローカルストレージに保存する簡易実装
    const csvContent = convertToCSV(items);
    localStorage.setItem(`csv_${endpoint}`, csvContent);
    
    // 開発環境でのデバッグ用にコンソールに出力
    console.log(`CSV data saved to localStorage (key: csv_${endpoint}):`, csvContent);
    
    return {
      success: true,
      message: 'データが保存されました'
    };
  } catch (error) {
    console.error('Error saving CSV data:', error);
    return {
      success: false,
      message: 'データの保存に失敗しました: ' + error.message
    };
  }
};

/**
 * CSVデータをファイルとしてエクスポートする
 * @param {Array} items - エクスポートするオブジェクトの配列
 * @param {string} fileName - エクスポートするファイル名
 */
export const exportCSV = (items, fileName) => {
  const csvContent = convertToCSV(items);
  downloadCSV(csvContent, fileName);
};

/**
 * CSVデータをファイルとして保存する（実際のファイルシステムに）
 * 注意: これはデモ用の簡易実装です。実際のプロダクション環境では使用しないでください。
 * @param {Array} items - 保存するオブジェクトの配列
 * @param {string} filePath - 保存先のファイルパス
 * @returns {Promise} - 保存処理の結果
 */
export const saveCSVToFile = async (items, filePath) => {
  try {
    const csvContent = convertToCSV(items);
    
    // ファイルのダウンロードを促す（実際のファイルシステムには保存されません）
    downloadCSV(csvContent, filePath.split('/').pop());
    
    return {
      success: true,
      message: `CSVファイルがダウンロードされました。このファイルを ${filePath} に配置してください。`
    };
  } catch (error) {
    console.error('Error saving CSV file:', error);
    return {
      success: false,
      message: 'CSVファイルの保存に失敗しました: ' + error.message
    };
  }
};
