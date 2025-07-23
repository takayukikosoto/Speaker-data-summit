/**
 * FAQ管理用のユーティリティ関数
 */

/**
 * FAQデータをロードする
 * @returns {Promise<Object>} FAQデータ
 */
export const loadFAQ = async () => {
  try {
    const response = await fetch('/data/faq.json');
    if (!response.ok) {
      throw new Error(`Failed to load FAQ data: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error loading FAQ data:', error);
    return {
      categories: [],
      items: []
    };
  }
};

/**
 * FAQデータを保存する
 * @param {Object} faqData - 保存するFAQデータ
 * @returns {Promise<Object>} 保存結果
 */
export const saveFAQ = async (faqData) => {
  try {
    // 実際の環境ではサーバーサイドのAPIを呼び出す
    // ここではローカルストレージに保存する簡易実装
    localStorage.setItem('faq_data', JSON.stringify(faqData));
    
    // 開発環境でのデバッグ用にコンソールに出力
    console.log('FAQ data saved to localStorage:', faqData);
    
    return {
      success: true,
      message: 'FAQデータが保存されました'
    };
  } catch (error) {
    console.error('Error saving FAQ data:', error);
    return {
      success: false,
      message: 'FAQデータの保存に失敗しました: ' + error.message
    };
  }
};

/**
 * FAQデータをJSONファイルとしてエクスポートする
 * @param {Object} faqData - エクスポートするFAQデータ
 */
export const exportFAQ = (faqData) => {
  const jsonString = JSON.stringify(faqData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = 'faq.json';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * カテゴリーIDからカテゴリー名を取得する
 * @param {string} categoryId - カテゴリーID
 * @param {Array} categories - カテゴリー配列
 * @returns {string} カテゴリー名
 */
export const getCategoryName = (categoryId, categories) => {
  const category = categories.find(cat => cat.id === categoryId);
  return category ? category.name : categoryId;
};

/**
 * 新しいFAQ項目のIDを生成する
 * @param {string} question - 質問文
 * @returns {string} 生成されたID
 */
export const generateFaqId = (question) => {
  // 質問文から簡易的なIDを生成
  return question
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 30);
};
