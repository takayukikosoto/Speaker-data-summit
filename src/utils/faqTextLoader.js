/**
 * FAQ用のテキストローダーユーティリティ
 * LLMと人間の両方がアクセスしやすい形式のFAQデータを扱います
 */

/**
 * FAQテキストファイルを読み込む
 * @returns {Promise<string>} FAQテキスト
 */
export const loadFAQText = async () => {
  try {
    const response = await fetch('/data/faq_text.txt');
    if (!response.ok) {
      throw new Error(`Failed to load FAQ text: ${response.status} ${response.statusText}`);
    }
    
    return await response.text();
  } catch (error) {
    console.error('Error loading FAQ text:', error);
    return '';
  }
};

/**
 * FAQテキストを保存する
 * @param {string} faqText - 保存するFAQテキスト
 * @returns {Promise<Object>} 保存結果
 */
export const saveFAQText = async (faqText) => {
  try {
    // 実際の環境ではサーバーサイドのAPIを呼び出す
    // ここではローカルストレージに保存する簡易実装
    localStorage.setItem('faq_text', faqText);
    
    // 開発環境でのデバッグ用にコンソールに出力
    console.log('FAQ text saved to localStorage');
    
    return {
      success: true,
      message: 'FAQテキストが保存されました'
    };
  } catch (error) {
    console.error('Error saving FAQ text:', error);
    return {
      success: false,
      message: 'FAQテキストの保存に失敗しました: ' + error.message
    };
  }
};

/**
 * FAQテキストをファイルとしてエクスポートする
 * @param {string} faqText - エクスポートするFAQテキスト
 */
export const exportFAQText = (faqText) => {
  const blob = new Blob([faqText], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = 'faq_text.txt';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * FAQテキストからセクションを抽出する
 * @param {string} faqText - FAQテキスト
 * @returns {Array} セクションの配列
 */
export const extractSections = (faqText) => {
  if (!faqText) return [];
  
  // ## で始まる行をセクションの区切りとして使用
  const sectionRegex = /^## (.+)$/gm;
  const sections = [];
  let match;
  
  while ((match = sectionRegex.exec(faqText)) !== null) {
    sections.push({
      title: match[1],
      startIndex: match.index
    });
  }
  
  // 各セクションの終了位置を設定
  for (let i = 0; i < sections.length; i++) {
    if (i < sections.length - 1) {
      sections[i].endIndex = sections[i + 1].startIndex;
    } else {
      sections[i].endIndex = faqText.length;
    }
    
    // セクションの内容を抽出
    sections[i].content = faqText.substring(sections[i].startIndex, sections[i].endIndex);
  }
  
  return sections;
};

/**
 * FAQテキストからQ&Aを抽出する
 * @param {string} faqText - FAQテキスト
 * @returns {Array} Q&Aの配列
 */
export const extractQA = (faqText) => {
  if (!faqText) return [];
  
  // Q: で始まる行と、その後のA: で始まる行をペアとして抽出
  const qaRegex = /Q: (.+?)[\r\n]+A: (.+?)(?=[\r\n]+Q:|$)/gs;
  const qaItems = [];
  let match;
  
  while ((match = qaRegex.exec(faqText)) !== null) {
    qaItems.push({
      question: match[1].trim(),
      answer: match[2].trim()
    });
  }
  
  return qaItems;
};

/**
 * FAQテキストから特定のキーワードに関連するQ&Aを検索する
 * @param {string} faqText - FAQテキスト
 * @param {string} keyword - 検索キーワード
 * @returns {Array} 関連するQ&Aの配列
 */
export const searchFAQText = (faqText, keyword) => {
  if (!faqText || !keyword) return [];
  
  const qaItems = extractQA(faqText);
  const lowerKeyword = keyword.toLowerCase();
  
  // キーワードに関連するQ&Aをスコア付けして返す
  return qaItems
    .map(item => {
      const questionScore = item.question.toLowerCase().includes(lowerKeyword) ? 2 : 0;
      const answerScore = item.answer.toLowerCase().includes(lowerKeyword) ? 1 : 0;
      return {
        ...item,
        score: questionScore + answerScore
      };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score);
};
