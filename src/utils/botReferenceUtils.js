/**
 * チャットボットのリファレンスファイルを読み込むためのユーティリティ関数
 */

/**
 * リファレンスファイルを読み込む関数
 * @param {string} fileName - 読み込むファイル名
 * @returns {Promise<string>} - ファイルの内容
 */
export const loadReferenceFile = async (fileName) => {
  try {
    const response = await fetch(`/src/data/bot_references/${fileName}`);
    if (!response.ok) {
      throw new Error(`ファイルの読み込みに失敗しました: ${fileName}`);
    }
    return await response.text();
  } catch (error) {
    console.error(`リファレンスファイル読み込みエラー (${fileName}):`, error);
    return '';
  }
};

/**
 * 複数のリファレンスファイルを読み込む関数
 * @param {string[]} fileNames - 読み込むファイル名の配列
 * @returns {Promise<Object>} - ファイル名をキー、内容を値とするオブジェクト
 */
export const loadMultipleReferenceFiles = async (fileNames) => {
  const result = {};
  
  await Promise.all(
    fileNames.map(async (fileName) => {
      const content = await loadReferenceFile(fileName);
      result[fileName] = content;
    })
  );
  
  return result;
};

/**
 * 利用可能なすべてのリファレンスファイルを読み込む関数
 * @returns {Promise<Object>} - すべてのリファレンスファイルの内容
 */
export const loadAllReferences = async () => {
  const fileNames = [
    'event_info.txt',
    'sponsor_plans.txt',
    'faq.txt',
    'forms_info.txt',
    'forms_links.txt',
    'secret_room_features.txt'
  ];
  
  return await loadMultipleReferenceFiles(fileNames);
};

/**
 * リファレンスファイルの内容から質問に関連する情報を検索する関数
 * @param {string} query - 検索クエリ（ユーザーの質問）
 * @param {Object} references - リファレンスファイルの内容
 * @returns {string} - 関連する情報
 */
export const searchReferences = (query, references) => {
  // 検索キーワードを抽出（日本語と英語の両方に対応）
  const keywords = query.toLowerCase().match(/[a-zA-Z0-9_\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]+/g) || [];
  
  if (keywords.length === 0) {
    return '';
  }
  
  // フォーム関連のキーワードを抽出
  const formKeywords = [
    'フォーム', 'form', '登録', 'register', '申込', 'apply', 'application',
    'リンク', 'link', 'url', 'アドレス', 'address', 'ページ', 'page'
  ];
  
  // フォームの種類に関するキーワード
  const formTypeKeywords = [
    '参加', 'participant', 'スポンサー', 'sponsor', 'セッション', 'session',
    '企業', 'company', '講演', 'presentation', '展示', 'exhibition', 'booth',
    '搜入', 'logistics', 'プレス', 'press', '懇親会', 'party', 'networking',
    '問い合わせ', 'contact', 'ブース'
  ];
  
  // フォームのリンクに関する質問かどうかを判定
  const isFormLinkQuery = keywords.some(kw => formKeywords.includes(kw)) ||
                         (keywords.some(kw => formTypeKeywords.includes(kw)) && 
                          keywords.some(kw => ['url', 'リンク', 'link', 'アドレス', 'address'].includes(kw)));
  
  let relevantContent = '';
  let formLinksContent = '';
  
  // 各リファレンスファイルを検索
  Object.entries(references).forEach(([fileName, content]) => {
    // フォームリンクに関する質問で、forms_links.txtがあれば優先する
    if (isFormLinkQuery && fileName === 'forms_links.txt') {
      // ファイルを行に分割
      const lines = content.split('\n');
      
      // 関連するセクションを探す
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].toLowerCase();
        
        // キーワードに一致する行を見つけた場合
        if (keywords.some(keyword => line.includes(keyword)) || 
            formTypeKeywords.some(keyword => line.includes(keyword))) {
          // セクションの開始行を見つける（見出し行）
          let sectionStart = i;
          while (sectionStart > 0 && !lines[sectionStart].startsWith('##')) {
            sectionStart--;
          }
          
          // セクションの終了行を見つける（次の見出し行または最大15行）
          let sectionEnd = i;
          const maxLines = 15;
          while (sectionEnd < lines.length - 1 && 
                 !lines[sectionEnd + 1].startsWith('##') && 
                 sectionEnd - sectionStart < maxLines) {
            sectionEnd++;
          }
          
          // 関連セクションを抽出
          const section = lines.slice(sectionStart, sectionEnd + 1).join('\n');
          formLinksContent += section + '\n\n';
          
          // 次のセクションへ
          i = sectionEnd;
        }
      }
    } else {
      // 通常の検索処理
      // ファイルを行に分割
      const lines = content.split('\n');
      
      // 関連するセクションを探す
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].toLowerCase();
        
        // キーワードに一致する行を見つけた場合
        if (keywords.some(keyword => line.includes(keyword))) {
          // セクションの開始行を見つける（見出し行）
          let sectionStart = i;
          while (sectionStart > 0 && !lines[sectionStart].startsWith('#')) {
            sectionStart--;
          }
          
          // セクションの終了行を見つける（次の見出し行または最大10行）
          let sectionEnd = i;
          const maxLines = 10;
          while (sectionEnd < lines.length - 1 && 
                 !lines[sectionEnd + 1].startsWith('#') && 
                 sectionEnd - sectionStart < maxLines) {
            sectionEnd++;
          }
          
          // 関連セクションを抽出
          const section = lines.slice(sectionStart, sectionEnd + 1).join('\n');
          relevantContent += section + '\n\n';
          
          // 次のセクションへ
          i = sectionEnd;
        }
      }
    }
  });
  
  // フォームリンクの情報があれば、それを優先する
  if (formLinksContent) {
    return formLinksContent.trim();
  }
  
  return relevantContent.trim();
};
